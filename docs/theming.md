# Theming

Stuart Themes are a set of HTML templates used to structure, stylize and render Stuart Pages.

Themes are located and defined in the [`themes/`](definitions.md#themes) directory of the project root and must have a
[`themeconf.yaml`](definitions.md#themeconfyaml) file in their own directory.

For more information about Stuart Themes, check its [definition](definitions.md#project-theme).

## Templates

Projects expect a few HTML templates provided by the active Theme to build pages, these being:

- `index.html`: HTML of the Index/home page of the Project
- `page.html`: template for every page of the Project
- `category.html`: template for category roots which are pages themselves as well

## Theme Structure

A Theme has a bunch of files in its root directory:

- `templates/`
- [`themeconf.yaml`](definitions.md#themeconfyaml)
- [Assets](#theme-assets)

The following directory structure represents a Stuart Theme in a Stuart Project:

```
<project-root>/
  ...
  themes/
    default-theme/
      templates/
        category.html
        index.html
        page.html
      assets/
        styles.css
        icon.svg
      themeconf.yaml
  ...
  stuartconf.yaml
```

## Requirements

Below are the requirements for a Stuart Theme to be valid.

### Theme requirements

For a theme to be valid it:

- must have a valid [`themeconf.yaml`](definitions.md#themeconfyaml) in its root directory.
- Template files under `templates/`

### Theme template requirements

For a template to be valid it:

- must be located under the `templates/` directory in the Theme Root and be one of the [available Content Templates](#templates).
- have exactly **one (1)** `{content}` content interpolation token in its HTML content. See [Content Interpolation](#content-interpolation).

## Theme Assets

Static assets, such as images, must be placed under the `assets/` directory.
They are available in the HTML template through the `@theme/` [content interpolation](#content-interpolation) token:

```html
<img src="{@theme/heart.svg}" alt="Heart" />
```

## Content Interpolation

Content can be injected exactly as it would be done in a Page's markdown file with brackets (`{}`).
Thus, using the special `content` token injects the content of the current Page in the build pipeline:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>{project.name} | {page.title}</title>
    <meta name="description" content="{project.description}" />
    <meta property="article:published_time" content="{page.date}" />
    <meta name="author" content="{project.author}" />
    <link rel="stylesheet" href="{@theme/styles.css}" />
  </head>
  <body>
    <div>Published on {page.date | date}</div>
    <main>{content}</main>
    <footer>
      <div>
        Made by
        <a href="{theme.author.homepage}"><img src="{@theme/picture.jpg}" /> {theme.author.name}</a>
      </div>
    </footer>
  </body>
</html>
```

Check the [definitions of Content Injection](definitions.md#content-interpolation) for more details.

## Build result

When a Stuart Project is built for publish, all its [HTML Templates](#templates) are used to build
the Pages available under the Project Content Root and its [Theme Assets](#theme-assets) are moved to `<project-root>/publish/_theme/`.
