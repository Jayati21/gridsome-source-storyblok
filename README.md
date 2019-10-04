# Gridsome Source Storyblok

The official [Storyblok](https://www.storyblok.com/) integration with [Gridsome](https://gridsome.org/)

## Install

```sh
yarn add gridsome-source-storyblok # or npm install gridsome-source-storyblok
```

## Usage

1. In `gridsome.config.js`, declare the use of the plugin and define the options:

```js
// in gridsome.config.js
{
  siteName: 'Gridsome',
  plugins: [
    {
      use: 'gridsome-source-storyblok',
      options: {
        client: {
          accessToken: '<YOUR_ACCESS_TOKEN>'
        },
        version: 'draft',
        typeName: 'StoryblokEntry'
      }
    }
  ],
  templates: {
    StoryblokEntry: '/:slug'
  }
}
```

2. In the `src/templates` folder create a `.vue` file with the same name you defined in the `typeName` option (default is `StoryblokEntry`). After that set a `<page-query>` tag to load the data from GraphQL. For example:

```html
<page-query>
query StoryblokEntry ($id: ID) {
  storyblokEntry (id: $id) {
    id
    slug
    content
  }
}
</page-query>
```

## The options object in details

When you declare the use of the Storyblok plugin you can pass following options:

```js
{
  use: 'gridsome-source-storyblok',
  options: {
    client: {
      // The Storyblok JS Client options here (https://github.com/storyblok/storyblok-js-client)
      accessToken: '<YOUR_ACCESS_TOKEN>' // required!
    },
    version: 'draft' // Optional. Can be draft or published (default draft)
    typeName: 'StoryblokEntry' // Optional. The template name (default StoryblokEntry)
    params: {} // Optional. Additional query parameters
    additionalTypes: [
      {type: 'datasources', name: 'StoryblokDatasource'},
      {type: 'datasource_entries', name: 'StoryblokDatasourceEntry', params: {...additionalQueryParams}},
      {type: 'tags', name: 'StoryblokTag'},
      {type: 'links', name: 'StoryblokLink'}
    ] // Optional: Get additional types like datasources, links or tags
  }
}
```

## Contribution

Fork me on [Github](https://github.com/storyblok/gridsome-source-storyblok)