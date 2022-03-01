import React, { useEffect, useState } from "react";
import { Button, Row, Col, Popconfirm, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { UserDeleteOutlined, UserAddOutlined } from "@ant-design/icons/lib/icons";
import S1Form from "./S1Form";
import S2Menu from "./S2Menu";
import { useApp } from "../../../providers/AppProvider";
import { SupplierAPIHelper } from "../../../api/SupplierAPIHelper";
import { View } from "../../../enums/View";
import MyLayout from "../../common/MyLayout";
import MyCard from "../../common/MyCard";
import S3History from "./S3History";

export default function ViewSupplierPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState();
  const [accountPayable, setAccountPayable] = useState(0);

  const breadcrumbs = [
    { url: "/supplier/supplier", name: "Supplier" },
    { url: "/supplier/suppliers", name: "Suppliers" },
    { url: `/supplier/suppliers/${supplier?.id}`, name: `${supplier?.company_name}` },
  ];

  useEffect(() => {
    SupplierAPIHelper.get({ id: id })
      .then((result) => {
        if (result.length === 0) {
          navigate('../');
          return;
        }
        setSupplier(result[0]);
      })
      .catch(handleHttpError);
  }, [id, handleHttpError, navigate]);

  useEffect(() => {
    if (supplier) {
      SupplierAPIHelper.getMyAccountPayable(supplier.id)
        .then((result) => {
          setAccountPayable(result[0].total);
        })
        .catch(handleHttpError);
    }
  }, [supplier, handleHttpError]);

  function handleDeactivate() {
    setLoading(true);
    const promise = supplier.deactivated_date == null ? SupplierAPIHelper.deactivate(supplier.id) : SupplierAPIHelper.activate(supplier.id);
    promise.then(newFields => {
      setLoading(false);
      setSupplier({...supplier, ...newFields });
      message.success(`Supplier successfully ${supplier.deactivated_date == null ? 'deactivated' : 'activated' }!`);
    })
    .catch(handleHttpError)
    .catch(() => setLoading(false));
  }

  function renderDeactivateButton() {
    if (!hasWriteAccessTo(View.SCM.name)) {
      return <></>
    }
    
    return (
      <>
        { supplier.deactivated_date == null ? 
          <Popconfirm title="Confirm deactivate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
            <Button type="danger" loading={loading} icon={<UserDeleteOutlined />} style={{ width: 120 }}>Deactivate</Button>
          </Popconfirm>
          :
          <Popconfirm title="Confirm activate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading}>
            <Button type="primary" loading={loading} icon={<UserAddOutlined />} style={{ width: 120 }}>Activate</Button>
          </Popconfirm>
        }
      </>
    )
  }

  return (
    <>
      {supplier != null && (
        <MyLayout breadcrumbs={breadcrumbs} bannerTitle={`${supplier.company_name} ${ supplier.deactivated_date == null ? '' : '(Deactivated)' }`} bannerRight={renderDeactivateButton()}>
          
          <Row>

            <Col xl={10} xs={24}>
              <MyCard>
                <S1Form supplier={supplier} setSupplier={setSupplier} />
              </MyCard>
            </Col>

            <Col xl={14} xs={24}>

              <MyCard title="Quick View">
                {supplier.company_name} has outstanding account payables of&nbsp;
                <Typography.Title level={5} style={{ display: 'inline-block'}}>{`$${(+accountPayable).toFixed(2)}`}</Typography.Title>.
              </MyCard>

              <MyCard style={{ flexGrow: 1 }}>
                <S2Menu supplier={supplier} />
              </MyCard>

            </Col>

          </Row>

          <MyCard style={{ marginTop: 0 }}>
            <S3History supplier={supplier} />
          </MyCard>

        </MyLayout>
      )}
    </>
  );
}
