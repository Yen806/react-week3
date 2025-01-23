function Pagination({pageInfo, btnChangePage}) {
    
    return (
        <div className="d-flex justify-content-center">
            <nav>
                <ul className={`pagination ${pageInfo.total_pages <= 1 && 'd-none'}`}>
                    <li className={`page-item ${!pageInfo.has_pre && 'disabled'}`}>
                        <a className="page-link" href="#" onClick={() => btnChangePage(pageInfo.current_page - 1)}>上一頁</a>
                    </li>
                    {Array.from({ length: pageInfo.total_pages }).map((item, index) => (
                        <li className={`page-item ${pageInfo.current_page === index + 1 && 'active'}`} key={index}>
                            <a className="page-link" href="#" onClick={() => btnChangePage(index + 1)}>{index + 1}</a>
                        </li>))}

                    <li className={`page-item ${!pageInfo.has_next && 'disabled'}`}>
                        <a className="page-link" href="#" onClick={() => btnChangePage(pageInfo.current_page + 1)}>下一頁</a>
                    </li>
                </ul>
            </nav>
        </div>)
}

export default Pagination