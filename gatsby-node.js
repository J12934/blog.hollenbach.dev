const _ = require('lodash');
const Promise = require('bluebird');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js');
    resolve(
      graphql(
        `
          query {
            site {
              siteMetadata {
                title
                description
              }
            }
            allMarkdownRemark(
              sort: { fields: [frontmatter___date], order: DESC }
            ) {
              edges {
                node {
                  fields {
                    slug
                  }
                  timeToRead
                  frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    title
                    spoiler
                  }
                }
              }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          console.log(result.errors);
          reject(result.errors);
        }

        // Create blog posts pages.
        const posts = result.data.allMarkdownRemark.edges;

        _.each(posts, (post, index) => {
          const previous =
            index === posts.length - 1 ? null : posts[index + 1].node;
          const next = index === 0 ? null : posts[index - 1].node;

          createPage({
            path: post.node.fields.slug,
            component: blogPost,
            context: {
              slug: post.node.fields.slug,
              previous,
              next,
            },
          });
        });
      })
    );
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (_.get(node, 'internal.type') === `MarkdownRemark`) {
    createNodeField({
      node,
      name: 'directoryName',
      value: path.basename(path.dirname(_.get(node, 'fileAbsolutePath'))),
    });

    // Capture a list of what looks to be absolute internal links.
    // We'll later remember which of them have translations,
    // and use that to render localized internal links when available.

    // TODO: check against links with no trailing slashes
    // or that already link to translations.
    const markdown = node.internal.content;
    let maybeAbsoluteLinks = [];
    let linkRe = /\]\((\/[^\)]+\/)\)/g;
    let match = linkRe.exec(markdown);
    while (match != null) {
      maybeAbsoluteLinks.push(match[1]);
      match = linkRe.exec(markdown);
    }
    createNodeField({
      node,
      name: 'maybeAbsoluteLinks',
      value: _.uniq(maybeAbsoluteLinks),
    });
  }
};
