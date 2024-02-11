const { registerBlockType } = wp.blocks;
const { apiFetch } = wp;
const { useState, useEffect } = wp.element;
const { CheckboxControl, PanelBody, TextControl, SelectControl, Button } = wp.components;

const { InspectorControls, InnerBlocks } = wp.blockEditor;
const ALLOWED_BLOCKS = ['core/paragraph', 'core/heading'];

registerBlockType( 'vip-commerce/vip-commerce-collection-block', {
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
      default: [],
    },
  },

  edit: ( props ) => {
    const { attributes: { collection, selectedProducts }, setAttributes } = props;
    const [ selectedCollection, setSelectedCollection ] = useState( collection );
    const [ products, setProducts ] = useState( [] );
    const [ collections, setCollections ] = useState( [] );
    const [ selectedProductIds, setSelectedProductIds ] = useState(selectedProducts || []);

    useEffect( () => {
      apiFetch( { path: '/vip-commerce/v1/collections' } )
        .then( data => {
          setCollections( data.collections );
        } );
    }, [] );

    useEffect(() => {
      if (selectedCollection) {
        apiFetch( { path: `/vip-commerce/v1/products-by-collection?collection=${selectedCollection}` } )
          .then(data => {
            setProducts(data.products);
          });
      }
    }, [selectedCollection]);

    const onCollectionChange = (collectionId) => {
      setSelectedCollection(collectionId);
      setAttributes( { collection: collectionId } );
    };

    const onProductSelectionChange = (productId, isSelected) => {
      const newSelectedProducts = isSelected
        ? [...selectedProducts, productId]
        : selectedProducts.filter((id) => id !== productId);
      setAttributes({ selectedProducts: newSelectedProducts });
    };

    const displayedProducts = products.filter(product => selectedProducts.includes(product.id));


    //const selectedProductData = products.find( product => product.id === selectedProduct );
    //let productData = selectedProductData;
    // if (!products) {
    //   products = [{
    //     id: '',
    //     name: 'Product Name',
    //     description: 'Product Description',
    //     price: '0.00',
    //     image: 'https://via.placeholder.com/360x360'
    //   }];
    // }

    return (
      <>
        <InspectorControls>
          <PanelBody title="Collection Settings" initialOpen={true}>
            <SelectControl
              label="Select a Collection"
              value={selectedCollection}
              options={[
                { label: 'Select a Collection', value: '' },
                ...collections.map(collection => ({ label: collection.title, value: collection.id }))
              ]}
              onChange={onCollectionChange}
            />
          </PanelBody>
          <PanelBody title="Product Selection" initialOpen={true}>
            {products.map((product) => (
              <CheckboxControl
                key={product.id}
                label={product.name}
                checked={selectedProductIds.includes(String(product.id))}
                onChange={(isSelected) => onProductSelectionChange(product.id, isSelected)}
              />
            ))}
          </PanelBody>
        </InspectorControls>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gridGap: '1em' }}>
          {displayedProducts.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '1em' }}>
              <img src={product.image} alt={product.name} />
              <h2>{product.name}</h2>
              <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
              <p>${parseFloat(product.price).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <InnerBlocks allowedBlocks={ ALLOWED_BLOCKS } />
      </>
    );
  },

  save: ( props ) => {
    return ( <InnerBlocks.Content /> );
  },
} );