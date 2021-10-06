#!/usr/bin/python2

# ^ We're using python2 because on the CS dept's
# machines, python3 doesn't not have lxml installed and installing it
# manually failed.

import argparse
from glob import glob
import os
import sys
import lxml.etree
import lxml.html

import markdown


labs_dir = "labs/"
projects_dir = "projects/"
directories_to_process = [labs_dir, projects_dir]
markdown_dir = "markdown/"
html_dir = "html/"
# directory where final webpages are stored
public_dir = "public/"
# Template into which generated HTML fragments are inserted to create
# complete webpages.
template_filename = "template.html"


def switch_path_dir(path, new_dir, new_ext=None):
    """Switches a file path to the given sibling directory.
    Optionally changes file extension as well.

    Example:
    switch_path_dir("./labs/markdown/test.md", "templates/", new_ext=".html")
    returns "./labs/templates/test.html".

    """
    path_parts = path.split(os.sep)
    filename = path_parts[-1]
    new_parent_path = os.sep.join(path_parts[:-2] + [new_dir])
    if new_ext is not None:
        new_filename = os.path.splitext(filename)[0] + new_ext
    else:
        new_filename = filename
    new_path = os.path.join(new_parent_path, new_filename)
    return new_path


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--force",
        "-f",
        required=False,
        action="store_true",
        help="Process files without confirming.")
    parser.add_argument("files", type=str, nargs="*")
    return parser.parse_args()


def main():
    args = parse_args()
    files = args.files
    # If no files specified, then process all labs and projects
    if len(files) == 0:
        for d in directories_to_process:
            markdown_glob = os.path.join(d, markdown_dir) + "/*md"
            files += glob(markdown_glob)

    # Confirm that user wants to process these files
    print("Processing the following files:")
    for f in files:
        print(f)
    print("")
    if not args.force:
        ok = ""
        while ok not in ["y", "n"]:
            ok = raw_input("ok? [y/n]: ")
            if ok == "n":
                print("Cancelled.")
                exit()

    for md in files:
        # Convert each markdown file to HTML snippet that will later be put
        # into a template to make a full page.
        html_filename = switch_path_dir(md, html_dir, new_ext=".html")
        markdown.markdownFromFile(
            input=md, output=html_filename, extensions=[
                "markdown.extensions.fenced_code"])

        template = lxml.html.parse(template_filename)
        section = template.find(".//section")

        html_str = open(html_filename, "r").read()
        html_fragments = lxml.html.fragments_fromstring(html_str)
        for frag in html_fragments:
            section.append(frag)

        webpage_filename = switch_path_dir(html_filename, public_dir)
        template.write(webpage_filename)


if __name__ == "__main__":
    main()
