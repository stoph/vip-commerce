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
      setAttributes({ 
        collection: collectionId,
        selectedProducts: []
      });    };

    const onProductSelectionChange = (productId, isSelected) => {
      const updatedSelectedProducts = isSelected
        ? [...selectedProducts, productId]
        : selectedProducts.filter(id => id !== productId);
      setAttributes({ selectedProducts: updatedSelectedProducts });
    };

    const displayedProducts = selectedProducts.length > 0
      ? products.filter(product => selectedProducts.includes(product.id))
      : products;

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
                checked={selectedProducts.includes(product.id)}
                onChange={(isSelected) => onProductSelectionChange(product.id, isSelected)}
              />
            ))}
          </PanelBody>
        </InspectorControls>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gridGap: '1em' }}>
          {displayedProducts.map((product) => (
            <div key={product.id} style={{ border: '1px solid #ccc', padding: '1em' }}>
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              {product.description && (
                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>${parseFloat(product.price).toFixed(2)}</div>
                {/* <Button isPrimary>Add to Cart</Button> */}
                <Button isPrimary>View Product</Button>
              </div>
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