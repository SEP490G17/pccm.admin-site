import { observer } from 'mobx-react-lite';
import './style.scss';
import { useState } from 'react';
import ServiceTab from './Tabs/ServiceLogTabComponent';
import ServiceLogTab from './Tabs/ServiceTabComponent';


const ServicePage = observer(() => {
  const [openServiceTab, setOpenServiceTab] = useState(true);
  return (
    <>
      {
        !openServiceTab && <ServiceTab setOpenServiceTab={setOpenServiceTab} openServiceTab={openServiceTab} />
      }
      {
        openServiceTab && <ServiceLogTab setOpenServiceTab={setOpenServiceTab} openServiceTab={openServiceTab} />
      }
    </>
  );
});

export default ServicePage;
