# Definitions and Rules

## Core

Core parts definitions.

### Project

A Stuart Project. A project is, in essence, composed by a `stuartconf.yaml` file. This YAML file defining the directory it is in as the **project root**.

It can also have the following directories:

- [`content/`](#project-content)
- [`themes/`](#project-theme)
- [`static/`](#project-static-files)

### Project Content

Main content of a Stuart Project that is written by a user.

Contains only **[Stuart Pages](#page)** and **[Stuart Page Categories](#page-category)**.

### Project Theme

Themes are HTML files containing content interpolation keys to be used in a Stuart Project.

Projects can have any amount of installed themes; however, **use only one (1) or none at a time during development and build**. This means themes are optional.

Themes are located in the `themes/` directory of the project root:

```
<project-root>/
  ...
  themes/
    default-theme/
  ...
  stuartconf.yaml
```

### Project Static Files

Static files that [Stuart Pages](#page) have access, such as images, icons, documents etc.

### Page

A Stuart Page.

Can be created either through a [`Page Model`](#page-model) or by the user, but only written by the latter.

Must have an `index.md` with a valid [YAML frontmatter](https://www.markdownlang.com/advanced/frontmatter.html).

### Page Category

Each and every name that comes before the name of a page in a directory representation.

For a directory in the dir tree to be a valid category, it must have a `category.md` file as a direct child. This means that every page inside a directory listed under `<project-root>/content` with a `category.md` file have a category.

Pages can only have **one (1)** category.

Categories are either located in the `<project-root>/content/` directory or in another category as a subcategory:

```
<project-root>/
  content/
    facts/            Empty category, as it only has category.md
      category.md
    animals/          Category with subcategories
      category.md
      cats/
        category.md
        ...
      dogs/
        category.md

  ...
  stuartconf.yaml
```

The categories above can be represented as:

- `facts`
- `animals`
- `animals/cats`
- `animals/dogs`

## Stuart Templates

Reusable templates applied when creating a project or page.

### Page Model

`index.md` template file of a [Stuart Page](#page).

### Blueprints

Whole [Stuart Project](#project) templates composed by a set of [Page Models](#page-model) and [Project Themes](#project-theme).
