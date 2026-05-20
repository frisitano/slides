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
readonly DECKS_OUTPUT_DIR="${OUTPUT_DIR}/decks"
readonly MARP_CLI="npx -y @marp-team/marp-cli@latest"
readonly MDBOOK_CLI="mdbook"

# Track discovered decks for presentations page
declare -a deck_names=()
declare -a deck_titles=()
declare -a deck_nav_titles=()
declare -a deck_categories=()
declare -a category_order=("EIP-8025" "Research" "Other")
readonly RESEARCH_SECTION_TITLE="Post Qauntum Data Availability"

declare -a writeup_titles=(
    "EIP-8025 Lighthouse architecture for maintainers"
    "EIP-8025 validator proof re-signing"
    "EIP-8025 network announcement and proof gossip"
)
declare -a writeup_nav_titles=(
    "Lighthouse Architecture"
    "Re-signing note"
    "Proof gossip"
)
declare -a writeup_urls=(
    "https://hackmd.io/F4RtMrHgSm2Flw8iUbq2xA?view"
    "https://hackmd.io/@frisitano/HkCzVt-a-x"
    "https://hackmd.io/@frisitano/H1XJS3XTZx"
)
declare -a writeup_slugs=(
    "eip8025-lighthouse-architecture"
    "eip8025-validator-proof-resigning"
    "eip8025-network-announcement-proof-gossip"
)
declare -a writeup_sources=(
    "writeups/eip8025-lighthouse-architecture.md"
    "writeups/eip8025-validator-proof-resigning.md"
    "writeups/eip8025-network-announcement-proof-gossip.md"
)
declare -a writeup_descriptions=(
    "Maintainer-facing architecture writeup for the Lighthouse EIP-8025 implementation."
    "Design note explaining why validator proof re-signing was deprecated."
    "Network writeup covering announcement, fetch, and proof-gossip tradeoffs."
)

declare -a research_writeup_titles=(
    "Post Quantum Proofs of Reed-Solomon Codes with LeanAIR"
    "Pipelined PQ blob dissemination"
)
declare -a research_writeup_nav_titles=(
    "PQ RS Proofs with LeanAIR"
    "Pipelined PQ blob dissemination"
)
declare -a research_writeup_slugs=(
    "leanair-construction-4-direct-air"
    "pipelined-blob-proof-dissemination"
)
declare -a research_writeup_sources=(
    "writeups/leanair-construction-4-direct-air.md"
    "writeups/pipelined-blob-proof-dissemination.md"
)
declare -a research_writeup_descriptions=(
    "LeanAIR experiment proving a post-quantum Reed-Solomon data-availability commitment with only the essential Poseidon, WHIR, wiring, and row-code checks."
    "Short bandwidth analysis using a concrete 100 kB proof example to compare pipelined column-sample diffs against an end-of-slot burst."
)

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

# Extract a simple scalar value from YAML frontmatter.
extract_frontmatter_value() {
    local slides_file="$1"
    local key="$2"

    awk -v key="${key}" '
        NR == 1 && $0 == "---" { in_frontmatter = 1; next }
        in_frontmatter && $0 == "---" { exit }
        in_frontmatter && index($0, key ":") == 1 {
            sub("^[^:]+:[[:space:]]*", "", $0)
            gsub(/^["'\'' ]+|["'\'' ]+$/, "", $0)
            print
            exit
        }
    ' "${slides_file}" 2>/dev/null || true
}

# Extract title from slides.md
extract_title() {
    local slides_file="$1"
    local deck_name="$2"

    # Prefer explicit frontmatter title because title slides are often short.
    local title
    title=$(extract_frontmatter_value "${slides_file}" "title")

    if [[ -z "${title}" ]]; then
        # Fallback: first H1 heading.
        title=$(grep -m 1 "^# " "${slides_file}" 2>/dev/null | sed 's/^# //' || echo "")
    fi

    if [[ -z "${title}" ]]; then
        # Fallback: capitalize deck name and replace hyphens with spaces.
        title=$(echo "${deck_name}" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1')
    fi

    echo "${title}"
}

extract_category() {
    local slides_file="$1"
    local category
    category=$(extract_frontmatter_value "${slides_file}" "category")
    if [[ -z "${category}" ]]; then
        category="Other"
    fi
    echo "${category}"
}

get_deck_nav_title() {
    local deck_name="$1"
    local deck_title="$2"
    case "${deck_name}" in
        eip8025-acdc-proposal-2026-05-14) echo "ACDC Proposal" ;;
        eip-8025-overview) echo "Overview Deck" ;;
        optional-proofs-2026-02-11) echo "Feb 11 Progress" ;;
        optional-proofs-2026-03-11) echo "Mar 11 Progress" ;;
        optional-proofs-2026-04-08) echo "Apr 8 Progress" ;;
        optional-proofs-2026-05-13) echo "May 13 Progress" ;;
        leanvm-fold-in-circuit-das-2026-05-08) echo "PQ RS Proofs with LeanVM" ;;
        *) echo "${deck_title}" ;;
    esac
}

deck_priority() {
    local deck_name="$1"
    case "${deck_name}" in
        eip-8025-overview) echo "000" ;;
        eip8025-acdc-proposal-2026-05-14) echo "010" ;;
        optional-proofs-2026-02-11) echo "020" ;;
        optional-proofs-2026-03-11) echo "030" ;;
        optional-proofs-2026-04-08) echo "040" ;;
        optional-proofs-2026-05-13) echo "050" ;;
        *) echo "900" ;;
    esac
}

sort_decks_for_index() {
    if [[ ${#deck_names[@]} -eq 0 ]]; then
        return 0
    fi

    local sorted_indices=()
    local sorted_index
    while IFS= read -r sorted_index; do
        sorted_indices+=("${sorted_index}")
    done < <(
        for i in "${!deck_names[@]}"; do
            printf '%s\t%s\t%s\n' "$(deck_priority "${deck_names[$i]}")" "${deck_names[$i]}" "$i"
        done | sort -k1,1 -k2,2 | cut -f3
    )

    local sorted_names=()
    local sorted_titles=()
    local sorted_nav_titles=()
    local sorted_categories=()
    local i
    for i in "${sorted_indices[@]}"; do
        sorted_names+=("${deck_names[$i]}")
        sorted_titles+=("${deck_titles[$i]}")
        sorted_nav_titles+=("${deck_nav_titles[$i]}")
        sorted_categories+=("${deck_categories[$i]}")
    done

    deck_names=("${sorted_names[@]}")
    deck_titles=("${sorted_titles[@]}")
    deck_nav_titles=("${sorted_nav_titles[@]}")
    deck_categories=("${sorted_categories[@]}")
}

# Clean and recreate output directory
prepare_output_dir() {
    log_info "Preparing output directory..."
    rm -rf "${OUTPUT_DIR}"
    rm -rf "book/src/presentations" "book/src/writeups" "book/src/https:"
    mkdir -p "${DECKS_OUTPUT_DIR}"
    log_success "Output directory ready"
}

css_aspect_ratio() {
    local deck_size="$1"

    case "${deck_size}" in
        social-portrait) echo "1080 / 1240" ;;
        4:5) echo "1080 / 1240" ;;
        16:9) echo "16 / 9" ;;
        *) echo "16 / 9" ;;
    esac
}

css_deck_class() {
    local deck_size="$1"

    case "${deck_size}" in
        social-portrait) echo "deck-page-social-portrait" ;;
        4:5) echo "deck-page-social-portrait" ;;
        16:9) echo "deck-page-16-9" ;;
        *) echo "deck-page-16-9" ;;
    esac
}

write_book_deck_wrapper() {
    local deck_name="$1"
    local deck_title="$2"
    local deck_size="$3"
    local wrapper_dir="book/src/presentations/${deck_name}"
    local deck_aspect
    deck_aspect=$(css_aspect_ratio "${deck_size}")
    local deck_class
    deck_class=$(css_deck_class "${deck_size}")
    local deck_version
    deck_version=$(date +%Y%m%d%H%M%S)
    local deck_slide_heights
    deck_slide_heights=$(extract_frontmatter_value "${PRESENTATIONS_DIR}/${deck_name}/slides.md" "slideHeights")
    if [[ -z "${deck_slide_heights}" ]]; then
        deck_slide_heights="[]"
    fi
    local deck_adaptive_attr=""
    if [[ "${deck_slide_heights}" != "[]" ]]; then
        deck_adaptive_attr=' data-adaptive="true"'
    fi
    local deck_full_height
    deck_full_height=$(extract_frontmatter_value "${PRESENTATIONS_DIR}/${deck_name}/slides.md" "fittedHeight")
    if [[ -z "${deck_full_height}" ]]; then
        case "${deck_size}" in
            16:9) deck_full_height="810" ;;
            social-portrait) deck_full_height="1240" ;;
            4:5) deck_full_height="1240" ;;
            *) deck_full_height="810" ;;
        esac
    fi

    mkdir -p "${wrapper_dir}"
    cat > "${wrapper_dir}/index.md" <<EOF
<div class="deck-page ${deck_class}"${deck_adaptive_attr} style="--deck-full-height: ${deck_full_height};">
  <div class="deck-heading">
    <h1>${deck_title}</h1>
    <a href="../../decks/${deck_name}/index.html?v=${deck_version}">Open full screen</a>
  </div>

  <div class="deck-frame" style="--deck-aspect: ${deck_aspect};">
    <iframe class="marp-deck-frame" src="../../decks/${deck_name}/index.html?v=${deck_version}" title="${deck_title}" allowfullscreen loading="lazy"></iframe>
  </div>
</div>

<style>
.content main {
  max-width: none;
}
.deck-page {
  width: 100%;
  box-sizing: border-box;
  padding: 0 clamp(0px, 0.8vw, 12px) 0.75rem;
}
.deck-heading,
.deck-frame {
  width: min(100%, var(--deck-width-cap), calc(var(--deck-target-height) * var(--deck-current-width-ratio, var(--deck-width-ratio))));
  margin-inline: auto;
}
.deck-heading {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 1.15rem;
  margin-bottom: 0.2rem;
}
.deck-heading h1 {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.deck-heading > a {
  color: var(--links);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--links), transparent 62%);
  white-space: nowrap;
  font-size: 0.85rem;
}
.deck-frame {
  aspect-ratio: var(--deck-aspect);
  border: 1px solid var(--table-border-color);
  background: #f8fafc;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  position: relative;
}
.deck-page[data-adaptive="true"] .deck-frame {
  aspect-ratio: 1080 / var(--deck-current-height, var(--deck-full-height));
}
.deck-page-social-portrait,
.deck-page-4-5 {
  --deck-width-cap: 1080px;
  --deck-width-ratio: 0.870968;
  --deck-target-height: min(1240px, calc(100vh - var(--menu-bar-height) - 2.4rem));
}
.deck-page-16-9 {
  --deck-width-cap: 1440px;
  --deck-width-ratio: 1.7778;
  --deck-target-height: min(810px, calc(100vh - var(--menu-bar-height) - 2.4rem));
}
.deck-frame iframe {
  width: 100%;
  height: var(--deck-iframe-height, 100%);
  border: 0;
  background: #f8fafc;
  display: block;
  position: absolute;
  inset: 0 auto auto 0;
}
.nav-wrapper,
.nav-wide-wrapper,
.nav-chapters,
.mobile-nav-chapters {
  display: none !important;
}
body.deck-page-active .nav-chapters {
  pointer-events: none !important;
}
@media (max-width: 720px) {
  .deck-page {
    padding-inline: 0;
  }
  .deck-heading {
    justify-content: flex-start;
  }
}
</style>

<script>
document.body.classList.add('deck-page-active');
const marpDeckFrame = document.querySelector('.marp-deck-frame');
const deckPage = document.querySelector('.deck-page');
const deckFrame = document.querySelector('.deck-frame');
const deckSlideHeights = ${deck_slide_heights};
const deckFullHeight = Number.parseFloat(getComputedStyle(deckPage).getPropertyValue('--deck-full-height')) || 1272;
let lastKnownSlide = 0;
function focusMarpDeck() {
  try {
    marpDeckFrame?.contentWindow?.focus();
  } catch (_) {
    marpDeckFrame?.focus();
  }
}
function marpDocument() {
  try {
    return marpDeckFrame?.contentDocument || marpDeckFrame?.contentWindow?.document || null;
  } catch (_) {
    return null;
  }
}
function prepareEmbeddedDeck() {
  const doc = marpDocument();
  if (!doc) return;
  doc.querySelectorAll('a[href^="http"]').forEach(function (anchor) {
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
  });
  if (!doc.getElementById('mdbook-embedded-deck-style')) {
    const style = doc.createElement('style');
    style.id = 'mdbook-embedded-deck-style';
    style.textContent = 'body,.bespoke-marp-parent{background:#f8fafc!important;}';
    doc.head.appendChild(style);
  }
}
function activeSlideIndex() {
  const doc = marpDocument();
  const active = doc?.querySelector('svg.bespoke-marp-slide.bespoke-marp-active section[id]');
  const parsed = Number.parseInt(active?.id || '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed - 1 : lastKnownSlide;
}
function applyAdaptiveHeight(index) {
  if (!deckSlideHeights.length || !deckFrame || !deckPage) return;
  const safeIndex = Math.max(0, Math.min(index, deckSlideHeights.length - 1));
  const currentHeight = deckSlideHeights[safeIndex] || deckFullHeight;
  lastKnownSlide = safeIndex;
  deckFrame.style.setProperty('--deck-current-height', String(currentHeight));
  deckFrame.style.setProperty('--deck-current-width-ratio', (1080 / currentHeight).toFixed(6));
  deckFrame.style.setProperty('--deck-iframe-height', ((deckFullHeight / currentHeight) * 100).toFixed(4) + '%');
}
function syncAdaptiveHeight() {
  applyAdaptiveHeight(activeSlideIndex());
}
function sendDeckKey(key) {
  focusMarpDeck();
  try {
    marpDeckFrame?.contentWindow?.dispatchEvent(new KeyboardEvent('keydown', {
      key: key,
      code: key,
      bubbles: true,
      cancelable: true
    }));
  } catch (_) {}
  window.setTimeout(syncAdaptiveHeight, 80);
  window.setTimeout(syncAdaptiveHeight, 180);
}
function installAdaptiveDeckFrame() {
  prepareEmbeddedDeck();
  if (!deckSlideHeights.length) return;
  const doc = marpDocument();
  if (!doc) return;
  const observer = new MutationObserver(syncAdaptiveHeight);
  observer.observe(doc.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  syncAdaptiveHeight();
}
marpDeckFrame?.addEventListener('load', focusMarpDeck);
marpDeckFrame?.addEventListener('load', installAdaptiveDeckFrame);
marpDeckFrame?.addEventListener('pointerdown', focusMarpDeck);
applyAdaptiveHeight(0);
document.addEventListener('keydown', function (event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.stopImmediatePropagation();
  sendDeckKey(event.key);
}, true);
</script>
EOF
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

    # Extract title and category from slides
    local deck_title
    deck_title=$(extract_title "${deck_dir}/slides.md" "${deck_name}")
    local deck_category
    deck_category=$(extract_category "${deck_dir}/slides.md")
    local deck_nav_title
    deck_nav_title=$(get_deck_nav_title "${deck_name}" "${deck_title}")
    local deck_size
    deck_size=$(extract_frontmatter_value "${deck_dir}/slides.md" "size")

    # Create output directory for this deck
    local deck_output_dir="${DECKS_OUTPUT_DIR}/${deck_name}"
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

    write_book_deck_wrapper "${deck_name}" "${deck_title}" "${deck_size}"

    # Add to deck lists for presentations page
    deck_names+=("${deck_name}")
    deck_titles+=("${deck_title}")
    deck_nav_titles+=("${deck_nav_title}")
    deck_categories+=("${deck_category}")

    log_success "Built ${deck_name}: ${deck_title}"
}

# Update SUMMARY.md with grouped presentation navigation
generate_summary() {
    log_info "Generating SUMMARY.md..."

    # Create book source directory if it doesn't exist
    mkdir -p book/src

    cat > "book/src/SUMMARY.md" <<'EOF'
# Summary

[Home](./README.md)

EOF

    for category in "${category_order[@]}"; do
        local category_heading="${category}"
        if [[ "${category}" == "Research" ]]; then
            category_heading="${RESEARCH_SECTION_TITLE}"
        fi
        local wrote_heading=0
        for i in "${!deck_names[@]}"; do
            if [[ "${deck_categories[$i]}" != "${category}" ]]; then
                continue
            fi
            if [[ ${wrote_heading} -eq 0 ]]; then
                echo "# ${category_heading}" >> "book/src/SUMMARY.md"
                echo "" >> "book/src/SUMMARY.md"
                wrote_heading=1
            fi
            local deck_name="${deck_names[$i]}"
            local deck_nav_title="${deck_nav_titles[$i]}"
            echo "- [${deck_nav_title}](presentations/${deck_name}/index.md)" >> "book/src/SUMMARY.md"
        done

        if [[ "${category}" == "EIP-8025" && ${#writeup_titles[@]} -gt 0 ]]; then
            if [[ ${wrote_heading} -eq 0 ]]; then
                echo "# ${category_heading}" >> "book/src/SUMMARY.md"
                echo "" >> "book/src/SUMMARY.md"
                wrote_heading=1
            fi
            for i in "${!writeup_titles[@]}"; do
                echo "- [${writeup_nav_titles[$i]}](writeups/${writeup_slugs[$i]}.md)" >> "book/src/SUMMARY.md"
            done
        fi

        if [[ "${category}" == "Research" && ${#research_writeup_titles[@]} -gt 0 ]]; then
            if [[ ${wrote_heading} -eq 0 ]]; then
                echo "# ${category_heading}" >> "book/src/SUMMARY.md"
                echo "" >> "book/src/SUMMARY.md"
                wrote_heading=1
            fi
            for i in "${!research_writeup_titles[@]}"; do
                echo "- [${research_writeup_nav_titles[$i]}](writeups/${research_writeup_slugs[$i]}.md)" >> "book/src/SUMMARY.md"
            done
        fi

        if [[ ${wrote_heading} -eq 1 ]]; then
            echo "" >> "book/src/SUMMARY.md"
        fi
    done

    log_success "SUMMARY.md generated"
}

generate_writeup_pages() {
    log_info "Generating inline writeup pages..."

    mkdir -p book/src/writeups
    if [[ -d "writeups/diagrams" ]]; then
        mkdir -p book/src/writeups/diagrams
        cp -R writeups/diagrams/. book/src/writeups/diagrams/
    fi

    for i in "${!writeup_titles[@]}"; do
        local page="book/src/writeups/${writeup_slugs[$i]}.md"
        local source_file="${writeup_sources[$i]}"

        if [[ -f "${source_file}" ]]; then
            cat > "${page}" <<EOF
<div class="writeup-origin">
  <a href="${writeup_urls[$i]}">Open original HackMD</a>
</div>

EOF
            cat "${source_file}" >> "${page}"
        else
            cat > "${page}" <<EOF
# ${writeup_titles[$i]}

${writeup_descriptions[$i]}

[Open HackMD](${writeup_urls[$i]})
EOF
        fi
    done

    for i in "${!research_writeup_titles[@]}"; do
        local page="book/src/writeups/${research_writeup_slugs[$i]}.md"
        local source_file="${research_writeup_sources[$i]}"

        if [[ -f "${source_file}" ]]; then
            cp "${source_file}" "${page}"
        else
            cat > "${page}" <<EOF
# ${research_writeup_titles[$i]}

${research_writeup_descriptions[$i]}
EOF
        fi
    done

    log_success "Inline writeup pages generated"
}

generate_writeups_summary() {
    # EIP-8025 writeups are included directly under the EIP-8025 SUMMARY section.
    return 0
}
# Update README.md with grouped presentation index
generate_homepage() {
    log_info "Generating Tau Lepton landing page..."

    cat > "book/src/README.md" <<'EOF'
<style>
.tl-page {
  max-width: 1040px;
}
.tl-hero {
  padding: 2rem 0 1.35rem;
  border-bottom: 1px solid var(--table-border-color);
  margin-bottom: 1.25rem;
}
.tl-hero h1 {
  margin: 0;
  font-size: 2.9rem;
  line-height: 1;
}
.tl-subtitle {
  margin: 0.35rem 0 0;
  color: var(--fg);
  opacity: 0.76;
  font-size: 1.34rem;
  line-height: 1.25;
}
.tl-intro {
  max-width: 780px;
  margin: 1rem 0 0;
  font-size: 1.16rem;
  line-height: 1.5;
}
.tl-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.1rem;
}
.tl-links a {
  color: var(--links);
  text-decoration: none;
  border-bottom: 1px solid color-mix(in srgb, var(--links), transparent 62%);
  white-space: nowrap;
}
.tl-section {
  margin: 1.6rem 0;
}
.tl-section h2 {
  margin: 0 0 0.7rem;
  font-size: 1.25rem;
}
.tl-list {
  border-top: 1px solid var(--table-border-color);
}
.tl-item {
  display: grid;
  grid-template-columns: minmax(11.5rem, 12.5rem) minmax(0, 1fr);
  gap: 1.25rem;
  padding: 0.78rem 0;
  border-bottom: 1px solid var(--table-border-color);
}
.tl-meta {
  color: var(--fg);
  opacity: 0.65;
  font-size: 0.9rem;
  line-height: 1.35;
}
.tl-body a {
  color: var(--links);
  font-weight: 650;
  text-decoration: none;
}
.tl-body a:hover {
  text-decoration: underline;
}
.tl-body p {
  margin: 0.2rem 0 0;
  color: var(--fg);
  opacity: 0.82;
  font-size: 1rem;
  line-height: 1.45;
}
@media (max-width: 720px) {
  .tl-hero h1 {
    font-size: 2.25rem;
  }
  .tl-item {
    grid-template-columns: 1fr;
    gap: 0.24rem;
  }
}
</style>

<div class="tl-page">

<section class="tl-hero">
  <h1>Tau Lepton</h1>
  <p class="tl-subtitle">zkEVM @ Ethereum Foundation</p>
  <p class="tl-intro">Slides and writeups on Ethereum scaling, optional execution proofs, zkEVM infrastructure, data availability, and proof-system design.</p>
  <nav class="tl-links">
    <a href="https://github.com/frisitano">GitHub</a>
    <a href="https://x.com/TauLepton_">X / Twitter</a>
  </nav>
</section>

<section class="tl-section">
  <h2>EIP-8025</h2>
  <div class="tl-list">
    <div class="tl-item">
      <div class="tl-meta">Deck<br>EIP-8025</div>
      <div class="tl-body">
        <a href="presentations/eip-8025-overview/index.html">Overview Deck</a>
        <p>Visual resource deck covering the execution proof flow.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Deck<br>May 14, 2026</div>
      <div class="tl-body">
        <a href="presentations/eip8025-acdc-proposal-2026-05-14/index.html">ACDC proposal</a>
        <p>Proposal for optional execution proofs in Hegota.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Writeup<br>CL</div>
      <div class="tl-body">
        <a href="writeups/eip8025-lighthouse-architecture.html">Lighthouse Architecture</a>
        <p>Maintainer-facing architecture notes for upstreaming EIP-8025 support.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Writeup<br>Network</div>
      <div class="tl-body">
        <a href="writeups/eip8025-network-announcement-proof-gossip.html">Network announcement and proof gossip</a>
        <p>Announcement, fetch, and gossip tradeoffs for execution proofs.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Writeup<br>Design</div>
      <div class="tl-body">
        <a href="writeups/eip8025-validator-proof-resigning.html">Validator proof re-signing</a>
        <p>Design note explaining why validator proof re-signing was deprecated.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Progress<br>Feb 11</div>
      <div class="tl-body">
        <a href="presentations/optional-proofs-2026-02-11/index.html">February progress update</a>
        <p>Consensus layer integration, proof engine, and proof gossip protocol.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Progress<br>Mar 11</div>
      <div class="tl-body">
        <a href="presentations/optional-proofs-2026-03-11/index.html">March progress update</a>
        <p>Optional proof design and implementation progress.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Progress<br>Apr 8</div>
      <div class="tl-body">
        <a href="presentations/optional-proofs-2026-04-08/index.html">April progress update</a>
        <p>Protocol updates, implementation status, and open questions.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Progress<br>May 13</div>
      <div class="tl-body">
        <a href="presentations/optional-proofs-2026-05-13/index.html">May progress update</a>
        <p>Latest EIP-8025 progress, implementation work, and devnet status.</p>
      </div>
    </div>
  </div>
</section>

<section class="tl-section">
  <h2>Post Qauntum Data Availability</h2>
  <div class="tl-list">
    <div class="tl-item">
      <div class="tl-meta">Deck<br>May 8, 2026</div>
      <div class="tl-body">
        <a href="presentations/leanvm-fold-in-circuit-das-2026-05-08/index.html">Post Quantum Proofs of Reed-Solomon Codes with leanVM</a>
        <p>Research deck on proof systems for Reed-Solomon codes and data availability sampling.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Writeup<br>LeanAIR</div>
      <div class="tl-body">
        <a href="writeups/leanair-construction-4-direct-air.html">Post Quantum Proofs of Reed-Solomon Codes with LeanAIR</a>
        <p>LeanAIR experiment proving a post-quantum Reed-Solomon data-availability commitment with only the essential Poseidon, WHIR, wiring, and row-code checks.</p>
      </div>
    </div>
    <div class="tl-item">
      <div class="tl-meta">Writeup<br>DAS</div>
      <div class="tl-body">
        <a href="writeups/pipelined-blob-proof-dissemination.html">Pipelined PQ blob dissemination</a>
        <p>Bandwidth analysis of a concrete 100 kB proof example comparing pipelined column-sample diffs with an end-of-slot burst.</p>
      </div>
    </div>
  </div>
</section>

</div>
EOF

    log_success "Tau Lepton landing page generated"
}


generate_writeups_homepage() {
    return 0
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

    sort_decks_for_index
    echo ""

    # Step 3: Generate mdbook pages
    generate_writeup_pages
    echo ""

    generate_summary
    echo ""

    generate_writeups_summary
    echo ""

    generate_homepage
    echo ""

    generate_writeups_homepage
    echo ""

    # Step 4: Build mdbook site
    build_mdbook
    echo ""

    # Step 5: Render Marp decks into the mdBook output without overwriting wrappers
    log_info "Rendering Marp decks into site/decks..."
    mkdir -p "${DECKS_OUTPUT_DIR}"
    for deck_dir in "${PRESENTATIONS_DIR}"/*/ ; do
        if [[ -d "${deck_dir}" && -f "${deck_dir}/slides.md" ]]; then
            local deck_name
            deck_name=$(basename "${deck_dir}")
            local deck_output_dir="${DECKS_OUTPUT_DIR}/${deck_name}"
            mkdir -p "${deck_output_dir}"

            # Copy assets if they exist
            if [[ -d "${deck_dir}/assets" ]]; then
                cp -r "${deck_dir}/assets" "${deck_output_dir}/"
            fi

            # Build presentation
            ${MARP_CLI} --html --output "${deck_output_dir}/index.html" "${deck_dir}/slides.md" >/dev/null 2>&1
        fi
    done
    log_success "Marp decks rendered into site/decks"
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
