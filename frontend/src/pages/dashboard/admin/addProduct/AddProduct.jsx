import { useSelector } from "react-redux"
import { useAddProductMutation } from "../../../../redux/features/products/productsApi"
import { useState } from "react"
import TextInput from "./TextInput"
import SelectInput from "./SelectInput"
import UploadImage from "./UploadImage"
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

const categories = [
    {label: 'Select Category', value: ''},
    {label: 'Lighting', value: 'lighting'},
    {label: 'Kitchen Appliances', value: 'kitchen-appliances'},
    {label: 'Kitchen Accessories', value: 'kitchen-accessories'},
    {label: 'Furniture', value: 'furniture'},
    {label: 'Amenities', value: 'amenities'},
]

const AddProduct = () => {
    const {user} = useSelector((state) => state.auth)
    const [product, setProduct] = useState({
        name: '',
        category: '',
        price: '',
        wholesalerPrice: '',
        description: ''
    })
    const [image, setImage] = useState('')
    const [AddProduct, {isLoading, error}] = useAddProductMutation()

    const handleChange = (e) => {
        const {name, value} = e.target
        setProduct({
            ...product,
            [name]: value
        })
    }

    const navigate = useNavigate()

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!product.name || !product.category || !product.price || !product.description) {
            toast.error('Please fill all the required fields');
            return;
        }

        try {
            await AddProduct({...product, image, author: user?._id}).unwrap();
            toast.success('Product added successfully');
            setProduct({ name: '',
                category: '',
                price: '',
                description: ''})
                setImage('');
                navigate("/shop")
        } catch (error) {
            console.log("Failed to submit product", error);
        }
    }
    // const (data:product, error, isLoading) from useAddProductMutation()
  return (
    <div className="container mx-auto mt-8">
        <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput 
                label = "Product Name"
                name = "name"
                value = {product.name}
                onChange = {handleChange}
                type = "text"
                placeholder = "Product Name"
            />
            <SelectInput 
                label = "Category"
                name = "category"
                value = {product.category}
                onChange = {handleChange}
                options = {categories}
            />
            <TextInput 
                label = "Price"
                name = "price"
                value = {product.price}
                onChange={handleChange}
                type = "number"
                placeholder={50}
            />
            <TextInput 
                label = "Wholesaler Price"
                name = "wholesalePrice"
                value = {product.wholesalerPrice}
                onChange={handleChange}
                type = "number"
                placeholder={50}
            />
            <UploadImage 
                name = "image"
                id = "image"
                value = {e => setImage(e.target.value)}
                placeholder = "Upload image"
                setImage = {setImage}
            />
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700"></label>
                <textarea name="description" id="description" className="add-product-InputCSS" value ={product.description} placeholder = 'Write a product description'
                onChange={handleChange}></textarea>
            </div>

            <div>
                <button type = "submit" className="add-product-btn">Add Product</button>
            </div>

        </form>
    </div>
  )
}

export default AddProduct