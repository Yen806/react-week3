import { useEffect,useState } from 'react'
import axios from 'axios'


const baseUrl = import.meta.env.VITE_BASE_URL;



function LoginPage({ setIsAuth }) {
    const [account, setAccount] = useState({
        username: "",
        password: ""
    });
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
            // getProductList();
        } catch (error) {
            alert('登入失敗，請新輸入帳號密碼')
        }
    }
    
    return (
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

export default LoginPage