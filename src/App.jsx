
import { useEffect, useRef, useState } from 'react'
import './App.css'
import Pill from './components/pill';

function App() {

  const [searchTerm, setsearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProducts] = useState([]);
  const [selectedProductSet, setSelectedProductSets] = useState(new Set());
  const inputRef = useRef();
  

  const handleSelectedProduct = (product) => {
    setSelectedProducts([...selectedProduct, product]);
    setSelectedProductSets(new Set([...selectedProductSet,product.id]));
    setsearchTerm("");
    setSuggestions([]);

    inputRef.current.focus();
  };

  const handleRemoveProduct = (product) => {
    console.log(product);
    const updatedProducts = selectedProduct.filter(
      (selectedProduct) => selectedProduct.id !== product.id
      );

    setSelectedProducts(updatedProducts);

    const updatedProductIds = new Set(selectedProductSet);
    updatedProductIds.delete(product.id)
    setSelectedProductSets(updatedProductIds);
  };

  useEffect(() => {
    const fetchProducts = () => {
      if(searchTerm.trim() === ""){
        setSuggestions([]);
        return;
      }
  
      fetch(`https://dummyjson.com/products/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => {
          console.log(err);
        });
    };
    fetchProducts();
  },[searchTerm]);

  const handleBackspace = (e) => {
    if(e.key === "Backspace" && e.target.value === "" && selectedProduct.length > 0)
    {
      const lastProduct = selectedProduct[selectedProduct.length - 1];
      handleRemoveProduct(lastProduct);
      setSuggestions([]);
    }
  }

  return (
    <div className='product-search-container'>
      <div className="product-search-input">
        {/* pills */}
        {
          selectedProduct.map((product) => {
            return (
              <Pill 
                key={product.id}
                image={product.thumbnail}
                text={`${product.title}`}
                onClick={() => handleRemoveProduct(product)} 
              />
            );
          })
        }
        {/* input field with search suggestions */}
        <div>
          <input 
            ref={inputRef}
            type="text" 
            value={searchTerm} 
            onChange={(e) => setsearchTerm(e.target.value)}
            placeholder='Search product...'
            onKeyDown={handleBackspace}
            />
          {/* search Suggestions */}
          <ul className="suggestions-list">
            {suggestions?.products?.map((product, i) => {
              return !selectedProductSet.has(product.id) ?  (
                <li key={product.id} onClick={() => handleSelectedProduct(product)}>
                  <img 
                    src={product.thumbnail} 
                    alt={`${product.title}`} />

                    <span>{product.title}</span>
                </li>
              ) : 
              (<></>);
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
