import { CourtClusterDetailsCreate } from '@/app/models/court.model';
import { FormControl, Select, Input, Grid, GridItem, FormErrorMessage } from '@chakra-ui/react';
import { FastField, FormikErrors, FormikTouched } from 'formik';
import { useEffect, useState } from 'react';

interface Province {
  id: string;
  full_name: string;
}

interface District {
  id: string;
  full_name: string;
}

interface Ward {
  id: string;
  full_name: string;
}

interface FormValues {
  province: string;
  district: string;
  ward: string;
  address: string;
}

interface AddressSelectAtomProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  values: FormValues;
  errors: FormikErrors<CourtClusterDetailsCreate>;
  touched: FormikTouched<CourtClusterDetailsCreate>;
}

const AddressSelectAtom: React.FC<AddressSelectAtomProps> = ({
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    const fetchProvincesData = async () => {
      const response = await fetch('https://esgoo.net/api-tinhthanh/1/0.htm');
      const data = await response.json();
      if (data.error === 0) {
        setProvinces(data.data);
      }
    };

    const fetchDistrictsData = async (provinceId: string) => {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/2/${provinceId}.htm`);
      const data = await response.json();
      if (data.error === 0) {
        setDistricts(data.data);
      }
    };

    const fetchWardsData = async (districtId: string) => {
      const response = await fetch(`https://esgoo.net/api-tinhthanh/3/${districtId}.htm`);
      const data = await response.json();
      if (data.error === 0) {
        setWards(data.data);
      }
    };

    Promise.all([
      fetchProvincesData(),
      fetchDistrictsData(values.province),
      fetchWardsData(values.district),
    ]);
  }, [values]);

  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const idtinh = event.target.value;
    const selectedProvince = provinces.find((province) => province.id == idtinh);
    setFieldValue('province', idtinh);
    if (selectedProvince) {
      setFieldValue('provinceName', selectedProvince.full_name);
    }
    setFieldValue('district', 0);
    setFieldValue('districtName', '');
    setFieldValue('ward', 0);
    setFieldValue('wardName', '');
    setDistricts([]);
    setWards([]);

    fetch(`https://esgoo.net/api-tinhthanh/2/${idtinh}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setDistricts(data.data);
        }
      });
  };

  const handleDistrictChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const idquan = event.target.value;
    const selectedDistrict = districts.find((district) => district.id == idquan);
    setFieldValue('district', idquan);
    if (selectedDistrict) {
      setFieldValue('districtName', selectedDistrict.full_name);
    }
    setFieldValue('ward', 0);
    setFieldValue('wardName', '');
    setWards([]);

    fetch(`https://esgoo.net/api-tinhthanh/3/${idquan}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setWards(data.data);
        }
      });
  };

  const handleWardChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const idphuong = event.target.value;
    const selectedWard = wards.find((ward) => ward.id == idphuong);
    setFieldValue('ward', idphuong);
    if (selectedWard) {
      setFieldValue('wardName', selectedWard.full_name);
    }
  };

  return (
    <Grid templateColumns={'repeat(3,1fr)'} templateRows={'repeat(2,1fr)'} rowGap={5} columnGap={2}>
      <GridItem colSpan={1}>
        <FormControl isInvalid={!!(errors.province && touched.province)}>
          <Select
            value={values.province}
            onChange={handleProvinceChange}
            title="Chọn Tỉnh Thành"
            isRequired
          >
            <option value="0">Tỉnh Thành</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.full_name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.province}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl isInvalid={!!(errors.district && touched.district)}>
          <Select
            value={values.district}
            onChange={handleDistrictChange}
            title="Chọn Quận Huyện"
            disabled={!values.province}
            isRequired
          >
            <option value="0">Quận Huyện</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.full_name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.district}</FormErrorMessage>
        </FormControl>
      </GridItem>

      <GridItem colSpan={1}>
        <FormControl isInvalid={!!(errors.district && touched.district)}>
          <Select
            value={values.ward}
            onChange={handleWardChange}
            title="Chọn Phường Xã"
            disabled={!values.district}
            isRequired
          >
            <option value="0">Phường Xã</option>
            {wards.map((ward) => (
              <option key={ward.id} value={ward.id}>
                {ward.full_name}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.ward}</FormErrorMessage>
        </FormControl>
      </GridItem>
      <GridItem colSpan={3}>
        <FastField name="address">
          {({ field, form }: any) => (
            <FormControl isInvalid={form.errors.address && form.touched.address}>
              <Input placeholder="Nhập địa chỉ cụ thể" type="text" {...field} />
              <FormErrorMessage>{form.errors.address}</FormErrorMessage>
            </FormControl>
          )}
        </FastField>
      </GridItem>
    </Grid>
  );
};

export default AddressSelectAtom;
