import { observer } from 'mobx-react-lite';
import './style.scss';
import ProductTab from './Tabs/ProductTabComponent';
import ProductLogTab from './Tabs/ProductLogTabComponent';
import { useState } from 'react';

const ProductPage = observer(() => {
  const [openProductTab, setOpenProductTab] = useState(true);
  return (
    <>
      {
        openProductTab && <ProductTab setOpenProductTab={setOpenProductTab} openProductTab={openProductTab}/>
      }
      {
        !openProductTab && <ProductLogTab setOpenProductTab={setOpenProductTab} openProductTab={openProductTab}/>
      }
    </>
  );
})

export default ProductPage;
