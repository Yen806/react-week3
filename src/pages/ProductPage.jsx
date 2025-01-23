import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';
import DeleteModal from '../components/DeleteModal';
const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

const defaultModalState = {
    imageUrl: "",
    title: "",
    category: "",
    unit: "",
    origin_price: "",
    price: "",
    description: "",
    content: "",
    is_enabled: 0,
    imagesUrl: [""]
};


function ProductPage({setIsAuth}) {
    const [modalMode, setModalMode] = useState(null);
    const [products, setProducts] = useState([]);
    const [tempProduct, setTempProduct] = useState(defaultModalState);
    const modelRef = useRef(null);
    const delModelRef = useRef(null);
    const [pageInfo, getPageInfo] = useState({});

    //取得產品
    const getProductList = async (page = 1) => {
        try {
            const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products?page=${page}`);
            setProducts(res.data.products);
            getPageInfo(res.data.pagination)
        } catch (error) {
            alert('取得資料失敗')
        }
    }
    //確認是否登入
    const checkLogin = async () => {
        try {
            await axios.post(`${baseUrl}/v2/api/user/check`)
            setIsAuth(true);
            getProductList();
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, "$1");
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            checkLogin()
        }
    }, [])



    
    
    
    const openModal = (mode, product) => {
        setModalMode(mode);
        switch (mode) {
            case 'create':
                setTempProduct(defaultModalState);
                break;
            case 'edit':
                setTempProduct(product);
                break;
            default:
                break;
        }
        modelRef.current.show()
    }
    const openDelModal = (product) => {
        setTempProduct(product);
        delModelRef.current.show()
    }
    
    //換頁功能
    const btnChangePage = (page) => {
        getProductList(page);
    }
    return (<>
        <div className="container mt-5" >
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between">
                        <h2>產品列表</h2>
                        <button type="button" className="btn btn-primary" onClick={() => openModal('create')}>建立新的產品</button>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">產品名稱</th>
                                <th scope="col">原價</th>
                                <th scope="col">售價</th>
                                <th scope="col">是否啟用</th>
                                <th scope="col">查看細節</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                return (
                                    <tr key={product.id}>
                                        <th scope="row">{product.title}</th>
                                        <td>{product.origin_price}</td>
                                        <td>{product.price}</td>
                                        <td><a href="#" id={product.id} className="text-decoration-none">{product.is_enabled ? (<span className="text-success">啟用</span>) : (<span>未啟用</span>)}</a ></td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openModal('edit', product)}>編輯</button>
                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openDelModal(product)}>刪除</button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination pageInfo={pageInfo} btnChangePage={btnChangePage}/>
            </div>
        </div>

        <ProductModal modalMode={modalMode} setTempProduct={setTempProduct} tempProduct={tempProduct} getProductList={getProductList} modelRef={modelRef}/>

        <DeleteModal tempProduct={tempProduct} getProductList={getProductList} delModelRef={delModelRef}/>
    </>
    )
};

export default ProductPage