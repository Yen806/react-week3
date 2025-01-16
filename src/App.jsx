import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Modal } from 'bootstrap';

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

const baseUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;
function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([])
  const [tempProduct, setTempProduct] = useState(defaultModalState);
  const [isActive, setIsactive] = useState(true);
  const [modalMode, setModalMode] = useState(null)
  const [account, setAccount] = useState({
    username: "",
    password: ""
  });
  const productRef = useRef(null);
  const modelRef = useRef(null);
  const delProductRef = useRef(null);
  const delModelRef = useRef(null);


  //取得輸入的帳密
  const handlerLogin = (e) => {
    const { value, name } = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  }
  //登入按鈕
  const submitAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}/v2/admin/signin`, account);
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
      getProductList();
    } catch (error) {
      alert('登入失敗，請新輸入帳號密碼')
    }
  }
  //取得產品
  const getProductList = async () => {
    try {
      const res = await axios.get(`${baseUrl}/v2/api/${apiPath}/admin/products`);
      setProducts(res.data.products)
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

  //新增產品
  const createNewProduct = async () => {
    try {
      await axios.post(`${baseUrl}/v2/api/${apiPath}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      })
    } catch (error) {
      alert('新增資料失敗')
    }
  }
  //更新產品
  const updateProduct = async () => {
    try {
      await axios.put(`${baseUrl}/v2/api/${apiPath}/admin/product/${tempProduct.id}`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0
        }
      })
    } catch (error) {
      alert('修改資料失敗')
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

  const openDelModal = (product) => {
    setTempProduct(product);
    delModelRef.current.show()
  }
  const closeDelModal = () => {
    delModelRef.current.hide()
  }
  useEffect(() => {
    delModelRef.current = new Modal(delProductRef.current, {
      backdrop: false
    })
  }, [])

  //modal控制

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
  const closeModal = () => {
    modelRef.current.hide()
  }
  useEffect(() => {
    modelRef.current = new Modal(productRef.current, {
      backdrop: false
    })
  }, [])

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



  return (
    <>
      {
        isAuth ?
          (<div className="container mt-5" >
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
                              <button type="button" className="btn btn-outline-primary btn-sm" id={product.id} onClick={() => openModal('edit', product)}>編輯</button>
                              <button type="button" className="btn btn-outline-danger btn-sm" id={product.id} onClick={() => openDelModal(product)}>刪除</button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>) : (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
              <h1 className="mb-5">請先登入</h1>
              <form className="d-flex flex-column gap-3" onSubmit={submitAccount}>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="username" name="username" onChange={handlerLogin} value={account.username} placeholder="name@example.com" />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input type="password" className="form-control" id="password" name="password" onChange={handlerLogin} value={account.password} placeholder="Password" />
                  <label htmlFor="password">Password</label>
                </div>
                <button className="btn btn-primary">登入</button>
              </form>
              <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
            </div>
          )
      }

      <div className="modal" tabIndex="-1" ref={productRef} id="productModal">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalMode === 'create' ? '新增產品' : '編輯產品'}</h5>
              <button type="button" className="btn-close me-1" onClick={closeModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-4">
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

      <div className="modal fade" tabIndex="-1" ref={delProductRef} id="delProductModal">
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
    </>
  )
}

export default App
