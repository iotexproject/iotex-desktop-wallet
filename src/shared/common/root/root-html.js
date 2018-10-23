import Helmet from 'inferno-helmet';

import {assetURL} from '../../../lib/asset-url';

export function rootHtml({styletron, jsonGlobals, reactMarkup, clientScript}) {
  const styleBody = styletron.injectDeclaration({prop: 'margin', val: 0});
  const stylesheets = styletron.getStylesheetsHtml('styletron-global');
  const head = Helmet.rewind();

  return `<!DOCType html>
<html ${head.htmlAttributes.toString()} class="has-navbar-fixed-top">
  <head>
    ${head.title.toString()}
    ${head.meta.toString()} 
    ${head.link.toString()}
    ${head.style.toString()}
    <style type="text/css">* {font-family: Share Tech,Helvetica Neue,sans-serif;}</style>
    <link rel="icon" type="image/png" sizes="any" href="${assetURL('/favicon.png')}" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    ${stylesheets}
    ${jsonGlobals}
    ${head.script.toString()}
    ${loadDeferredStyles(`
      <link rel="stylesheet" type="text/css" href="${assetURL('/stylesheets/main.css')}">
     `)}
  </head>
  <body class=${styleBody}>
    <div id='root'>${reactMarkup}</div>
    ${clientScript ?
    `<script type="text/javascript" crossorigin="" src="${assetURL(clientScript)}"></script>` :
    ''
}
  </body>
</html>
`;
}

function loadDeferredStyles(stylesElements) {
  return `
    <noscript id="deferred-styles">
    ${stylesElements}
    </noscript>
    <script>
      var loadDeferredStyles = function() {
        var addStylesNode = document.getElementById("deferred-styles");
        var replacement = document.createElement("div");
        replacement.innerHTML = addStylesNode.textContent;
        document.body.appendChild(replacement)
        addStylesNode.parentElement.removeChild(addStylesNode);
      };
      var raf = requestAnimationFrame || mozRequestAnimationFrame ||
          webkitRequestAnimationFrame || msRequestAnimationFrame;
      if (raf) raf(function() { window.setTimeout(loadDeferredStyles, 0); });
      else window.addEventListener('load', loadDeferredStyles);
    </script>
  `;
}
