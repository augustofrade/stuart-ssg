# Definitions and Rules

## Composition

Parts that compose Stuart.

### Project

A Stuart Project. A project is, in essence, composed by a [`stuartconf.yaml`](#stuartconfyaml) file. This YAML file defines the directory it is in as the **Project Root**.

It can also have the following directories:

- [`content/`](#project-content)
- [`themes/`](#project-theme)
- [`static/`](#project-static-files)

### Project Content

Main content of a Stuart Project that is written by a user.

Contains only **[Stuart Pages](#page)** and **[Stuart Page Categories](#page-category)**.

### Project Theme

Themes are HTML files containing content interpolation keys for token injection to be used in a Stuart Project.

Themes are, in essence, composed by a [`themeconf.yaml`](#themeconfyaml) file. This YAML file defiens the directory it is in as the **Theme Root**.

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

For a directory in the dir tree to be a valid category, it must have a [`category.md`](#categorymd) file as a direct child. This means that every page inside a directory listed under `<project-root>/content` with a `category.md` file have a category.

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

## Files and directories

All the files that compose a Stuart Project.

### `stuartconf.yaml`

Stuart Project configuration file that sets the directory it is in as the Project Root.

It has the following structure and requires only the "Required" section to be considered valid:

```yaml
# Required
project:
  name: <string>
  author: <string>
  theme: <string>
# Optional (example)
props:
  github_url: https://github.com/augustofrade/stuart-ssg
```

All values that can be defined by the user other than the project details themselves must be under **`props`**.

See [Stuart Project structure](./project-structure.md#stuart-project-structure) for details of the contents it is accompanied by.

### `themeconf.yaml`

Stuart Theme configuration file that sets the directory it is in as the Theme Root.
It has the following structure and must contain all the properties in the "Required" section to be considered valid:

```yaml
# Required
name: <string>
version: <string>
author:
  name: <string>
  homepage: <string> # Optional
license: <string>
# Optional
homepage: <string>
```

See [Stuart Theme structure](./project-structure.md#stuart-theme-structure) for details of the contents it is accompanied by.

### `index.md`

Markdown file that sets the directory it is in as the Page Root.
Contains markdown content that is, obligatorily, preceeded by a frontmatter YAML content.
Must have the following YAML structure to be considered valid:

```yaml
---
title: <string>
date: <year-month-day>
author: <string>
description: <string>
---
<markdown-content...>
```

After project build, this file gets converted into an `index.html` file.

See [Stuart Page structure](./project-structure.md#stuart-page-structure) for details of the contents it is accompanied by.

### `category.md`

Markdown file that sets the directory it is in as the [Category](#page-category) Root.
Must contain a YAML frontmatter that is, optionaly, followed by a markdown content.
Must have the following YAML structure to be considered valid:

```yaml
---
title: <string>
---
<optional-markdown-content...>
```

After project build, this files gets converted into an `index.html` file.

See [Stuart Page Category structure](./project-structure.md#stuart-page-category-structure) for details of the contents it is accompanied by.

### Directories

#### `content/`

Main markdown content that composes the Stuart project and will be converted into static HTML content during build.

#### `publish/`

Static HTML content generated from the Stuart Project [Pages](#page) and [Theme](#project-theme). **This is the final product and ready to be deployed.**

#### `themes/`

Directory that contains all [Project Themes](#project-theme) available to the Stuart Project.

#### `static/`

Static content that will be available to all pages and selected theme during build time, such as images, documents etc.

## Core

Core definitions about Stuart.

### Build Context

All the values available during a build step, including project, page and theme data.

The Build Context is defined after the `beforeThemeTokenInjection` hook is executed in the [Page Build Process](./architecture.md#page-build-process), and may be modified by any subsequent steps.
Example:

```typescript
builder
  .beforeThemeTokenInjection((themeContent, context) => {
    context.project.name = "Custom project name from now on";
    // theme layout and every step after this
    // will have a different project name
  })
  .beforePageTokenInjection(pageContent, context) => {
    context.project.name = "Another project name"
    context.project.props.github_url = "...";
    context.page.title = "Custom page name"
  })
```

### Content Interpolation

Content Interpolation or Token Injection is the process in which the placeholders are replaced with tokens defined in different data sources, all made available through the [Build Context](#build-context).

Available data sources are:

- [`stuartconf.yaml`](#stuartconfyaml)
- [`themeconf.yaml`](#themeconfyaml)
- [`index.md`](#indexmd)
- [`category.md`](#categorymd)

The following page markdown code uses the "name" property of the project:

```
<project-root>/stuartconf.yaml
project:
  name: Awesome Project
  ...


# <project-root>/content/first-post
This is the first post of {project.name}!
```

And is converted to:

```markdown
This is the first post of Awesome Project!
```
