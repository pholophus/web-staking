import { ListRedux } from "./List.redux";
import MenuRedux from "./Menu.redux";

const ContainerRedux = () => {
  return (
    <>
      <div className={`w-full md:w-[1100px] md:mx-auto`}>
        <MenuRedux />
        <ListRedux />
      </div>
    </>
  );
};

export default ContainerRedux;
