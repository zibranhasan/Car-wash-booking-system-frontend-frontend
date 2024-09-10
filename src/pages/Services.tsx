import { useState } from "react";
import { Input, Select, Row, Col, Card, Typography, Button } from "antd";
import { useGetAllServiceQuery } from "../redux/api/serviceApi";
import { DollarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const { Title, Text } = Typography;
const { Option } = Select;

const Services = () => {
  const { data: servicesData, isLoading } = useGetAllServiceQuery(undefined);
  const services = servicesData?.data.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("price-asc");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDetailsClick = (id: string) => {
    navigate(`/services/${id}`); // Navigate to service details page
  };

  const filteredServices = services
    .filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm) ||
        service.description.toLowerCase().includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortType === "price-asc") return a.price - b.price;
      if (sortType === "price-desc") return b.price - a.price;
      if (sortType === "duration-asc") return a.duration - b.duration;
      if (sortType === "duration-desc") return b.duration - a.duration;
      return 0;
    });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Car Wash Services</Title>

      {/* Search Input */}
      <Input
        placeholder="Search services..."
        onChange={handleSearch}
        style={{
          marginBottom: 16,
          borderRadius: 5,
          border: "1px solid #5899f5",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          maxWidth: "300px",
        }}
      />

      {/* Sort Select */}
      <Select
        defaultValue="price-asc"
        onChange={(value) => setSortType(value)}
        style={{
          marginBottom: 16,
          width: 200,
          borderRadius: 5,

          boxShadow: "0 2px 4px #5899f5",
        }}
      >
        <Option value="price-asc">Price: Low to High</Option>
        <Option value="price-desc">Price: High to Low</Option>
        <Option value="duration-asc">Duration: Short to Long</Option>
        <Option value="duration-desc">Duration: Long to Short</Option>
      </Select>

      {/* Service Cards */}
      <Row gutter={[16, 16]}>
        {filteredServices.map((service) => (
          <Col key={service._id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              style={{
                borderRadius: 10,
                overflow: "hidden",
                width: "100%",
                height: "350px", // Fixed height
                border: "1px solid #5899f5",
              }}
              cover={
                <div
                  style={{
                    height: "150px",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #5899f5",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    {service.name}
                  </Title>
                </div>
              }
            >
              <div
                style={{ flex: 1, display: "flex", flexDirection: "column" }}
              >
                <Text type="secondary" style={{ marginBottom: "10px" }}>
                  {service.description.slice(0, 60)}
                  {service.description.length > 60 ? "..." : ""}
                </Text>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "auto",
                  }}
                >
                  <div>
                    <DollarOutlined style={{ fontSize: 16, marginRight: 8 }} />
                    <Text strong>${service.price}</Text>
                  </div>
                  <div>
                    <ClockCircleOutlined
                      style={{ fontSize: 16, marginRight: 8 }}
                    />
                    <Text>{service.duration} mins</Text>
                  </div>
                </div>
              </div>

              <Button
                type="primary"
                block
                style={{
                  marginTop: 16,
                  borderRadius: 5,
                  backgroundColor: "#4caf50",
                  border: "none",
                }}
                onClick={() => handleDetailsClick(service._id)} // Handle button click
              >
                Details
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Services;