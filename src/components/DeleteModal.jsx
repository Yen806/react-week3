import { useEffect, useRef, } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap';

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function DeleteModal({ tempProduct, getProductList, delModelRef}) {
    const delProductRef = useRef(null);

    useEffect(() => {
        delModelRef.current = new Modal(delProductRef.current, {
            backdrop: false
        })
    }, [])

    const closeDelModal = () => {
        delModelRef.current.hide()
    }
    //刪除產品
    const removeProduct = async () => {
        try {
            await axios.delete(`${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`)
            alert('刪除資料成功');
            getProductList()
            closeDelModal()
        } catch (error) {
            alert('修改資料失敗')
        }
    }
    return (
        <div className="modal fade" tabIndex="-1" ref={delProductRef} id="delProductModal" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">刪除產品</h5>
                        <button type="button" className="btn-close" onClick={closeDelModal} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        你是否要刪除
                        <span className="text-danger">{tempProduct.title}</span>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={closeDelModal}>取消</button>
                        <button type="button" className="btn btn-primary" onClick={removeProduct}>刪除</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal