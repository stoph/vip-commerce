/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/vip-commerce-block.js":
/*!***********************************!*\
  !*** ./src/vip-commerce-block.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const {
  registerBlockType
} = wp.blocks;
const {
  apiFetch
} = wp;
const {
  useState,
  useEffect
} = wp.element;
registerBlockType('vip-commerce/vip-commerce-block', {
  title: 'VIP Commerce Block',
  icon: 'smiley',
  category: 'common',
  edit: props => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
      apiFetch({
        path: '/vip-commerce/v1/products'
      }).then(data => {
        setProducts(data.products);
      });
    }, []);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gridGap: '1em'
      }
    }, products.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: product.id,
      style: {
        border: '1px solid #ccc',
        padding: '1em'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, product.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      dangerouslySetInnerHTML: {
        __html: product.description
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "$", parseFloat(product.price).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: product.image,
      alt: product.name,
      style: {
        maxWidth: '30%'
      }
    }))));
  },
  save() {
    return null;
  }
});

/***/ }),

/***/ "./src/vip-commerce-search-block.js":
/*!******************************************!*\
  !*** ./src/vip-commerce-search-block.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const {
  registerBlockType
} = wp.blocks;
const {
  apiFetch
} = wp;
const {
  useState,
  useEffect
} = wp.element;
const {
  TextControl,
  SelectControl,
  Button
} = wp.components;
const {
  InnerBlocks
} = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];
const {
  InspectorControls
} = wp.blockEditor;
const {
  PanelBody
} = wp.components;
registerBlockType('vip-commerce/vip-commerce-search-block', {
  title: 'VIP Commerce Search Block',
  icon: 'smiley',
  category: 'common',
  attributes: {
    searchPhrase: {
      type: 'string',
      default: ''
    },
    selectedProduct: {
      type: 'string',
      default: ''
    }
  },
  edit: props => {
    const {
      attributes: {
        searchPhrase,
        selectedProduct
      },
      setAttributes
    } = props;
    const [products, setProducts] = useState([]);
    useEffect(() => {
      if (searchPhrase) {
        apiFetch({
          path: `/vip-commerce/v1/products-by-name?search=${searchPhrase}`
        }).then(data => {
          setProducts(data.products);
        });
      }
    }, [searchPhrase]);
    const handleOnChange = value => {
      setAttributes({
        searchPhrase: value
      });
    };
    const handleOnSelectProduct = productId => {
      setAttributes({
        selectedProduct: productId
      });
    };
    const handleOnSelectButtonClick = () => {
      if (products.length === 1) {
        handleOnSelectProduct(products[0].id);
      }
    };
    const selectedProductData = products.find(product => product.id === selectedProduct);
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelBody, {
      title: "Product Search"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TextControl, {
      label: "Search Phrase",
      value: searchPhrase,
      onChange: handleOnChange
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SelectControl, {
      label: "Select a Product",
      value: selectedProduct,
      options: products.map(product => ({
        label: product.name,
        value: product.id
      })),
      onChange: handleOnSelectProduct
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
      isPrimary: true,
      onClick: handleOnSelectButtonClick
    }, "Select"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'flex'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '50%'
      }
    }, selectedProductData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, selectedProductData.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      dangerouslySetInnerHTML: {
        __html: selectedProductData.description
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "$", parseFloat(selectedProductData.price).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: selectedProductData.image,
      alt: selectedProductData.name,
      style: {
        maxWidth: '30%'
      }
    }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '50%'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS
    }))));
  },
  save: props => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'flex'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        width: '50%'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks.Content, null)));
  }
});

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vip_commerce_block__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vip-commerce-block */ "./src/vip-commerce-block.js");
/* harmony import */ var _vip_commerce_search_block__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vip-commerce-search-block */ "./src/vip-commerce-search-block.js");


})();

/******/ })()
;
//# sourceMappingURL=index.js.map