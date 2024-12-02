import { observer } from 'mobx-react-lite';
import './style.scss';
import { useEffect, useState } from 'react';
import ServiceTab from './Tabs/ServiceLogTabComponent';
import ServiceLogTab from './Tabs/ServiceTabComponent';
import { useStore } from '@/app/stores/store';

const ServicePage = observer(() => {
  const [openServiceTab, setOpenServiceTab] = useState(true);
  const { courtClusterStore } = useStore();
  useEffect(() => {
    courtClusterStore.loadCourtClusterListAll();
  }, [courtClusterStore]);
  return (
    <>
      {!openServiceTab && (
        <ServiceTab setOpenServiceTab={setOpenServiceTab} openServiceTab={openServiceTab} />
      )}
      {openServiceTab && (
        <ServiceLogTab setOpenServiceTab={setOpenServiceTab} openServiceTab={openServiceTab} />
      )}
    </>
  );
});

export default ServicePage;
