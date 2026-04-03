# Project Structure

## Stuart Project structure

Stuart Project available during development time.

```
<root>
  content/
    category-1/
      category.md
      page-in-category/
        index.md
      subcategory-1/
        category.md
        page-in-subcategory/
          index.md
    page-1/
      index.md

  publish/
    ...

  themes/
    theme-1/
      themeconf.yaml

  static/
    image-1.jpg

  stuartconf.yaml
```

### Stuart Page structure

```
<page-root>/
  index.md
  scoped-page-image-1.jpg
```

### Stuart Page Category structure

```
<project-content>/
  animals/
    category.md
    <category-content...>
    dogs/
      category.md
      <subcategory-content...>
```

### Stuart Theme structure

```
<project-themes>/
  theme-1/
    themeconf.yaml
```

## Published Project structure

Structure of a published Stuart Project

```
<root>
  ...
  publish/
    category-1/
      index.html
      page-in-category/
        index.html
      subcategory-1/
        index.html
        page-in-subcategory/
          index.html
    page-1/
      index.html

    static/
      image-1.jpg
  ...
```
