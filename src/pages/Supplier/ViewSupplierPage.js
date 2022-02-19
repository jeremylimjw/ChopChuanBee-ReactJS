import React, { useEffect, useState } from "react";
import MyCard from "../../components/layout/MyCard";
import { SupplierAPIHelper } from "../../api/supplier";
import { useApp } from "../../providers/AppProvider";
import MyLayout from "../../components/layout/MyLayout";
import { Button, Row, Col, Popconfirm, message, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { UserDeleteOutlined, UserAddOutlined } from "@ant-design/icons/lib/icons";
import S1Form from "../../components/supplierModule/S1Form";
import S2Menu from "../../components/supplierModule/S2Menu";
import S3History from "../../components/supplierModule/S3History";
import { View } from "../../enums/View";

export default function SupplierDetailPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { handleHttpError, hasWriteAccessTo } = useApp();

  const [loading, setLoading] = useState(false);
  const [supplier, setSupplier] = useState();

  const breadcrumbs = [
    { url: "/suppliers", name: "Supplier" },
    { url: `/suppliers/${supplier?.id}`, name: `${supplier?.company_name}` },
  ];

  useEffect(() => {
    SupplierAPIHelper.getById(id)
      .then((result) => {
        if (result.length === 0) {
          navigate('../');
          return;
        }
        setSupplier(result[0]);
      })
      .catch(handleHttpError);
  }, [id, handleHttpError, navigate]);

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
    return (
      <>
        { supplier.deactivated_date == null ? 
          <Popconfirm title="Confirm deactivate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading || !hasWriteAccessTo(View.SCM.name)}>
            <Button type="danger" loading={loading} icon={<UserDeleteOutlined />} style={{ width: 120 }} disabled={!hasWriteAccessTo(View.SCM.name)}>Deactivate</Button>
          </Popconfirm>
          :
          <Popconfirm title="Confirm activate?" placement='leftTop' onConfirm={handleDeactivate} disabled={loading || !hasWriteAccessTo(View.SCM.name)}>
            <Button type="primary" loading={loading} icon={<UserAddOutlined />} style={{ width: 120 }} disabled={!hasWriteAccessTo(View.SCM.name)}>Activate</Button>
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
                <Typography.Title level={5} style={{ display: 'inline-block'}}>$0.00</Typography.Title>.
              </MyCard>

              <MyCard style={{ flexGrow: 1 }}>
                <S2Menu supplier={supplier} />
              </MyCard>

            </Col>

          </Row>

          <MyCard style={{ marginTop: 0 }}>
            <S3History />
          </MyCard>

        </MyLayout>
      )}
    </>
  );
}
