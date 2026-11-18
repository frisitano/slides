{ pkgs, ... }:
{
  packages = with pkgs; [ bash coreutils gawk gnugrep gnused marp-cli mdbook python3 ];
  env.MARP_CLI = "${pkgs.marp-cli}/bin/marp";

  tasks."slides:build".exec = "bash scripts/build.sh";
  tasks."slides:marp-preview".exec = "PORT=8081 marp --html --server presentations";
  tasks."slides:book-preview".exec = "mdbook serve --hostname 127.0.0.1 --port 3005";
  tasks."slides:preview".exec = "python3 -m http.server 8000 --bind 127.0.0.1 --directory site";
}
