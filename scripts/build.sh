#!/usr/bin/env bash

# Marp Multi-Presentation Build Script with mdbook Landing Page
# Discovers all presentations in presentations/ and builds them
# Generates mdbook documentation site with links to all presentations

set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Color

# Configuration
readonly PRESENTATIONS_DIR="presentations"
readonly OUTPUT_DIR="site"
readonly PRESENTATIONS_OUTPUT_DIR="${OUTPUT_DIR}/presentations"
readonly MARP_CLI="npx -y @marp-team/marp-cli@latest"
readonly MDBOOK_CLI="mdbook"

# Track discovered decks for presentations page
declare -a deck_names=()
declare -a deck_titles=()

# Logging helpers
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Extract title from slides.md
extract_title() {
    local slides_file="$1"
    local deck_name="$2"

    # Try to find the first H1 heading (# Title)
    local title
    title=$(grep -m 1 "^# " "${slides_file}" 2>/dev/null | sed 's/^# //' || echo "")

    if [[ -z "${title}" ]]; then
        # Fallback: capitalize deck name and replace hyphens with spaces
        title=$(echo "${deck_name}" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')
    fi

    echo "${title}"
}

# Clean and recreate output directory
prepare_output_dir() {
    log_info "Preparing output directory..."
    rm -rf "${OUTPUT_DIR}"
    mkdir -p "${PRESENTATIONS_OUTPUT_DIR}"
    log_success "Output directory ready"
}

# Build a single presentation deck
build_deck() {
    local deck_dir="$1"
    local deck_name
    deck_name=$(basename "${deck_dir}")

    log_info "Building deck: ${deck_name}"

    # Check if slides.md exists
    if [[ ! -f "${deck_dir}/slides.md" ]]; then
        log_warning "Skipping ${deck_name} (no slides.md found)"
        return 0
    fi

    # Extract title from slides
    local deck_title
    deck_title=$(extract_title "${deck_dir}/slides.md" "${deck_name}")

    # Create output directory for this deck
    local deck_output_dir="${PRESENTATIONS_OUTPUT_DIR}/${deck_name}"
    mkdir -p "${deck_output_dir}"

    # Copy assets directory if it exists
    if [[ -d "${deck_dir}/assets" ]]; then
        log_info "  Copying assets..."
        cp -r "${deck_dir}/assets" "${deck_output_dir}/"
        log_success "  Assets copied"
    fi

    # Build presentation with Marp CLI
    log_info "  Generating HTML..."
    ${MARP_CLI} \
        --html \
        --output "${deck_output_dir}/index.html" \
        "${deck_dir}/slides.md"

    log_success "  HTML generated: ${deck_output_dir}/index.html"

    # Add to deck lists for presentations page
    deck_names+=("${deck_name}")
    deck_titles+=("${deck_title}")

    log_success "Built ${deck_name}: ${deck_title}"
}

# Update SUMMARY.md with all presentations
generate_summary() {
    log_info "Generating SUMMARY.md..."

    cat > "book/src/SUMMARY.md" <<'EOF'
# Summary

[Home](./README.md)

# Presentations

EOF

    for i in "${!deck_names[@]}"; do
        local deck_name="${deck_names[$i]}"
        local deck_title="${deck_titles[$i]}"
        echo "- [${deck_title}](presentations/${deck_name}/index.html)" >> "book/src/SUMMARY.md"
    done

    log_success "SUMMARY.md generated"
}

# Update README.md with presentation index
generate_homepage() {
    log_info "Generating homepage..."

    cat > "book/src/README.md" <<'EOF'
# Presentations

| Presentation | Link |
|--------------|------|
EOF

    for i in "${!deck_names[@]}"; do
        local deck_name="${deck_names[$i]}"
        local deck_title="${deck_titles[$i]}"
        echo "| **${deck_title}** | [▶️ View Slides](presentations/${deck_name}/index.html) |" >> "book/src/README.md"
    done

    log_success "Homepage generated"
}

# Build mdbook site
build_mdbook() {
    log_info "Building mdbook site..."

    ${MDBOOK_CLI} build

    log_success "mdbook site built to ${OUTPUT_DIR}/"
}

# Main build process
main() {
    echo ""
    log_info "=== Marp Multi-Presentation Build (with mdbook) ==="
    echo ""

    # Step 1: Prepare output directory
    prepare_output_dir
    echo ""

    # Step 2: Discover and build all presentations
    log_info "Discovering presentations..."

    if [[ ! -d "${PRESENTATIONS_DIR}" ]]; then
        log_error "Presentations directory not found: ${PRESENTATIONS_DIR}"
        exit 1
    fi

    local deck_count=0
    for deck_dir in "${PRESENTATIONS_DIR}"/*/ ; do
        if [[ -d "${deck_dir}" ]]; then
            build_deck "${deck_dir}"
            deck_count=$((deck_count + 1))
            echo ""
        fi
    done

    if [[ ${deck_count} -eq 0 ]]; then
        log_warning "No presentation directories found in ${PRESENTATIONS_DIR}/"
    fi

    # Step 3: Generate mdbook pages
    generate_summary
    echo ""

    generate_homepage
    echo ""

    # Step 4: Build mdbook site
    build_mdbook
    echo ""

    # Step 5: Rebuild presentations into the mdbook output
    log_info "Copying presentations into site..."
    mkdir -p "${PRESENTATIONS_OUTPUT_DIR}"
    for deck_dir in "${PRESENTATIONS_DIR}"/*/ ; do
        if [[ -d "${deck_dir}" && -f "${deck_dir}/slides.md" ]]; then
            local deck_name=$(basename "${deck_dir}")
            local deck_output_dir="${PRESENTATIONS_OUTPUT_DIR}/${deck_name}"
            mkdir -p "${deck_output_dir}"

            # Copy assets if they exist
            if [[ -d "${deck_dir}/assets" ]]; then
                cp -r "${deck_dir}/assets" "${deck_output_dir}/"
            fi

            # Build presentation
            ${MARP_CLI} --html --output "${deck_output_dir}/index.html" "${deck_dir}/slides.md" >/dev/null 2>&1
        fi
    done
    log_success "Presentations copied into site"
    echo ""

    # Summary
    log_success "=== Build Complete ==="
    log_info "Built ${#deck_names[@]} presentation(s)"
    for i in "${!deck_names[@]}"; do
        log_info "  - ${deck_names[$i]}: ${deck_titles[$i]}"
    done
    log_info "Output directory: ${OUTPUT_DIR}/"
    echo ""
    log_info "To preview locally, run:"
    echo "    npx serve ${OUTPUT_DIR}"
    echo ""
}

# Run main function
main "$@"
