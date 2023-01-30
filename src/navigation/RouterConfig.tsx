import { Routes, Route } from "react-router-dom";

export const RouterConfig = () => {
    return (
        <Routes>
            {/* List all public routes here */}
            {/* <Route path={ROOT} element={<Home />} /> */}


            {/**404 page */}
            <Route path="*">
                {/* <NotFound/> */}
            </Route>
        </Routes>
    )
}