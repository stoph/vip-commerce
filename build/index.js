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

/***/ "./src/vip-commerce-collection-block.js":
/*!**********************************************!*\
  !*** ./src/vip-commerce-collection-block.js ***!
  \**********************************************/
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
  CheckboxControl,
  PanelBody,
  TextControl,
  SelectControl,
  Button
} = wp.components;
const {
  InspectorControls,
  InnerBlocks
} = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];
registerBlockType('vip-commerce/vip-commerce-collection-block', {
  title: 'VIP Commerce Collection Block',
  icon: 'smiley',
  category: 'common',
  attributes: {
    searchPhrase: {
      type: 'string',
      default: ''
    },
    collection: {
      type: 'string',
      default: ''
    },
    selectedProducts: {
      type: 'array',
      default: []
    }
  },
  edit: props => {
    const {
      attributes: {
        collection,
        selectedProducts
      },
      setAttributes
    } = props;
    const [selectedCollection, setSelectedCollection] = useState(collection);
    const [products, setProducts] = useState([]);
    const [collections, setCollections] = useState([]);
    useEffect(() => {
      apiFetch({
        path: '/vip-commerce/v1/collections'
      }).then(data => {
        setCollections(data.collections);
      });
    }, []);
    useEffect(() => {
      if (selectedCollection) {
        apiFetch({
          path: `/vip-commerce/v1/products-by-collection?collection=${selectedCollection}`
        }).then(data => {
          setProducts(data.products);
        });
      }
    }, [selectedCollection]);
    const onCollectionChange = collectionId => {
      setSelectedCollection(collectionId);
      setAttributes({
        collection: collectionId,
        selectedProducts: []
      });
    };
    const onProductSelectionChange = (productId, isSelected) => {
      const updatedSelectedProducts = isSelected ? [...selectedProducts, productId] : selectedProducts.filter(id => id !== productId);
      setAttributes({
        selectedProducts: updatedSelectedProducts
      });
    };
    const displayedProducts = selectedProducts.length > 0 ? products.filter(product => selectedProducts.includes(product.id)) : products;
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelBody, {
      title: "Collection Settings",
      initialOpen: true
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SelectControl, {
      label: "Select a Collection",
      value: selectedCollection,
      options: [{
        label: 'Select a Collection',
        value: ''
      }, ...collections.map(collection => ({
        label: collection.title,
        value: collection.id
      }))],
      onChange: onCollectionChange
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelBody, {
      title: "Product Selection",
      initialOpen: true
    }, products.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CheckboxControl, {
      key: product.id,
      label: product.name,
      checked: selectedProducts.includes(product.id),
      onChange: isSelected => onProductSelectionChange(product.id, isSelected)
    })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gridGap: '1em'
      }
    }, displayedProducts.map(product => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      key: product.id,
      style: {
        border: '1px solid #ccc',
        padding: '1em'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: product.image,
      alt: product.name
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h4", null, product.name), product.description && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      dangerouslySetInnerHTML: {
        __html: product.description
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "$", parseFloat(product.price).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
      isPrimary: true
    }, "Add to Cart"))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS
    }));
  },
  save: props => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks.Content, null);
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
  apiFetch
} = wp;
const {
  useSelect
} = wp.data;
const {
  registerBlockType
} = wp.blocks;
const {
  useState,
  useEffect
} = wp.element;
const {
  TextControl,
  SelectControl,
  Button,
  PanelBody
} = wp.components;
const {
  InnerBlocks,
  InspectorControls
} = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];
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
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const postTags = useSelect(select => select('core/editor').getEditedPostAttribute('tags'), []);

    // Effect for recommended products based on postTags
    useEffect(() => {
      if (postTags && postTags.length > 0) {
        apiFetch({
          path: `/vip-commerce/v1/products-by-tag?tags=${postTags.join(',')}`
        }).then(data => {
          setRecommendedProducts(data.products);
        });
      }
    }, [postTags]);
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

    //const selectedProductData = products.find( product => product.id === selectedProduct );
    const selectedProductData = products.find(product => product.id === selectedProduct) || recommendedProducts.find(product => product.id === selectedProduct);
    let productData = selectedProductData;
    if (!productData) {
      productData = {
        name: 'Product Name',
        description: 'Product Description',
        price: '0.00',
        image: 'https://via.placeholder.com/360x360'
      };
    }
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelBody, {
      title: "Product Search"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TextControl, {
      label: "Search Phrase",
      value: searchPhrase,
      onChange: handleOnChange
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SelectControl, {
      label: "Select a Product",
      value: selectedProduct
      //options={ products.map( product => ( { label: product.name, value: product.id } ) ) }
      ,
      options: [{
        label: "Choose one...",
        value: ''
      }, ...products.map(product => ({
        label: product.name,
        value: product.id
      }))],
      onChange: handleOnSelectProduct
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Button, {
      isPrimary: true,
      onClick: handleOnSelectButtonClick
    }, "Select")), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PanelBody, {
      title: "Recommended Products"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(SelectControl, {
      label: "Select a Recommended Product",
      value: selectedProduct
      //options={recommendedProducts.map(product => ({ label: product.name, value: product.id }))}
      ,
      options: [{
        label: "Choose one...",
        value: ''
      }, ...recommendedProducts.map(product => ({
        label: product.name,
        value: product.id
      }))],
      onChange: handleOnSelectProduct
    }))), productData && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, productData.name), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "$", parseFloat(productData.price).toFixed(2)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("table", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tbody", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("tr", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", {
      style: {
        width: '240px'
      }
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
      src: productData.image,
      alt: productData.name
    })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("td", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
      dangerouslySetInnerHTML: {
        __html: productData.description
      }
    }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
      href: "https://stoph-test.myshopify.com/products/"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", null, "View Product"))))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks, {
      allowedBlocks: ALLOWED_BLOCKS
    }));
  },
  save: props => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(InnerBlocks.Content, null);
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
/* harmony import */ var _vip_commerce_collection_block__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vip-commerce-collection-block */ "./src/vip-commerce-collection-block.js");



//import './vip-commerce-pattern.js';

// TKTK: Remove this when we're ready to go live
const nonProdBar = document.getElementById('vip-non-prod-bar');
if (nonProdBar) {
  nonProdBar.remove();
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map