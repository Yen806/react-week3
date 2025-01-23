import { useEffect, useRef } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap';

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductModal({ modalMode, tempProduct, getProductList, setTempProduct, modelRef }) {
    const productRef = useRef(null);
    //新增產品
    const createNewProduct = async () => {
        try {
            const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/product`, {
                data: {
                    ...tempProduct,
                    origin_price: Number(tempProduct.origin_price),
                    price: Number(tempProduct.price),
                    is_enabled: tempProduct.is_enabled ? 1 : 0
                }
            })
        } catch (error) {
            alert(res.data.message)
        }
    }
    //更新產品
    const updateProduct = async () => {
        try {
            const res = await axios.put(`${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`, {
                data: {
                    ...tempProduct,
                    origin_price: Number(tempProduct.origin_price),
                    price: Number(tempProduct.price),
                    is_enabled: tempProduct.is_enabled ? 1 : 0
                }
            })
        } catch (error) {
            alert(res.data.message)
        }
    }
    //新增或更新產品
    const btnUpdateProduct = async () => {
        try {
            const apiswitch = modalMode === 'create' ? createNewProduct : updateProduct;
            await apiswitch();
            getProductList();
            closeModal()
        } catch (error) {
            alert('更新產品失敗')
        }

    }


    //上傳圖片
    const fileUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file-to-upload', file)
        try {
            const res = await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/upload`, formData);
            const upLoadImgUrl = res.data.imageUrl;
            setTempProduct({
                ...tempProduct,
                imageUrl: upLoadImgUrl
            })
        } catch (error) {

        }
    }
    //表單控制
    const getinputValue = (e) => {
        const { value, name, checked, type } = e.target;
        setTempProduct({
            ...tempProduct,
            [name]: type === "checkbox" ? checked : value
        })
    }
    const imageChange = (e, index) => {
        const { value } = e.target;
        const newImages = [...tempProduct.imagesUrl];
        newImages[index] = value;
        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })

    }
    const addImage = () => {
        const newImages = [...tempProduct.imagesUrl, ''];

        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }

    const removeImage = () => {
        const newImages = [...tempProduct.imagesUrl];

        newImages.pop();

        setTempProduct({
            ...tempProduct,
            imagesUrl: newImages
        })
    }
    //modal控制
    const closeModal = () => {
        modelRef.current.hide()
    }
    useEffect(() => {
        modelRef.current = new Modal(productRef.current, {
            backdrop: false
        })
    }, [])
    return (
        <div className="modal" tabIndex="-1" ref={productRef} id="productModal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
                        <button type="button" className="btn-close me-1" onClick={closeModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-4">
                                <div className="mb-5">
                                    <label htmlFor="fileInput" className="form-label"> 圖片上傳 </label>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        className="form-control"
                                        id="fileInput"
                                        onChange={fileUpload}
                                    />
                                </div>
                                <div className="mx-3">
                                    <label htmlFor="imageUrl" className="form-label">主圖</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="請輸入主圖網址"
                                            id="imageUrl"
                                            name="imageUrl"
                                            value={tempProduct.imageUrl} onChange={getinputValue} />
                                        <img src={tempProduct.imageUrl} alt={tempProduct.id} className="img-fluid" />
                                    </div>
                                </div>
                                <div className="border rounded-3">
                                    <div className="mx-3 mt-2">
                                        {tempProduct.imagesUrl?.map((item, index) => {
                                            return (<div key={index}>
                                                <label htmlFor={`imagesUrl-${index + 1}`} className="form-label">副圖{index + 1}</label>
                                                <div className="input-group mb-3">
                                                    <input type="text" className="form-control" placeholder="請輸入圖片網址" id={`imagesUrl-${index + 1}`} value={item} onChange={(e) => imageChange(e, index)} />
                                                    <img src={item} alt="" className="img-fluid" />
                                                </div>
                                            </div>
                                            )
                                        })}
                                        <div className="btn-group w-100">
                                            {tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !== '' && (<button className="btn btn-outline-primary btn-sm w-100" onClick={addImage}>新增圖片</button>)}
                                            {tempProduct.imagesUrl.length > 1 && (<button className="btn btn-outline-danger btn-sm w-100" onClick={removeImage}>取消圖片</button>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-8">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">標題</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        placeholder="請輸入標題"
                                        name="title"
                                        value={tempProduct.title}
                                        onChange={getinputValue} />
                                </div>
                                <div className="row g-4">
                                    <div className="col-6">
                                        <label htmlFor="category" className="form-label">分類</label>
                                        <select id="category" className="form-select" name="category" value={tempProduct.category} onChange={getinputValue}>
                                            <option value="">請選擇</option>
                                            <option value="蔬菜水果">蔬菜水果</option>
                                            <option value="蛋與乳品">蛋與乳品</option>
                                            <option value="水產海鮮">水產海鮮</option>
                                            <option value="生鮮肉品">生鮮肉品</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="unit" className="form-label">單位</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="unit"
                                            placeholder="請輸入單位"
                                            name="unit"
                                            value={tempProduct.unit}
                                            onChange={getinputValue} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="originPrice" className="form-label">原價</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="originPrice"
                                            placeholder="請輸入原價"
                                            name="origin_price"
                                            min="0"
                                            value={tempProduct.origin_price}
                                            onChange={getinputValue} />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="price" className="form-label">售價</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="price"
                                            placeholder="請輸入售價"
                                            name="price"
                                            min="0"
                                            value={tempProduct.price}
                                            onChange={getinputValue} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">產品描述</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        rows="2"
                                        name="description"
                                        value={tempProduct.description}
                                        onChange={getinputValue}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="content" className="form-label">說明內容</label>
                                    <textarea
                                        className="form-control"
                                        id="content"
                                        rows="5"
                                        name="content"
                                        value={tempProduct.content}
                                        onChange={getinputValue}></textarea>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox" id="isEnabled"
                                        name="is_enabled"
                                        checked={tempProduct.is_enabled}
                                        onChange={getinputValue} />
                                    <label className="form-check-label" htmlFor="isEnabled">
                                        是否啟用
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>取消</button>
                        <button type="button" className="btn btn-primary" onClick={btnUpdateProduct}>確認</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductModal