import React from "react";
import List from "../dashboard/List";


const Container = () => {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
        <div className="w-full md:w-[1100px] md:mx-auto">
            <List/>
        </div>
    </>
  );
}

export default Container;