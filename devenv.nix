{ pkgs, ... }:
let
  # Match Pages CI without changing the repository's mdBook configuration.
  mdbookPackages = import (builtins.fetchTree {
    type = "github";
    owner = "NixOS";
    repo = "nixpkgs";
    rev = "e0464e47880a69896f0fb1810f00e0de469f770a";
    narHash = "sha256-zy/ar3GpnzuGRCwrr6zV/QicoZcqd2kNNhkRDECfStU=";
  }) { system = pkgs.stdenv.hostPlatform.system; };
  mdbook = assert mdbookPackages.mdbook.version == "0.4.40"; mdbookPackages.mdbook;
in
{
  packages = with pkgs; [ bash coreutils gawk gnugrep gnused marp-cli python3 ] ++ [ mdbook ];
  env.MARP_CLI = "${pkgs.marp-cli}/bin/marp";

  tasks."slides:build".exec = "bash scripts/build.sh";
  tasks."slides:marp-preview".exec = "PORT=8081 marp --html --server presentations";
  tasks."slides:book-preview".exec = "mdbook serve --hostname 127.0.0.1 --port 3005";
  tasks."slides:preview".exec = "python3 -m http.server 8000 --bind 127.0.0.1 --directory site";
}
