import React, { useState } from "react";
import { MapPin, Truck, Package, Search } from "lucide-react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

// Initial data arrays remain unchanged
const initialDeliveryPersons = [
  {
    id: "D1",
    name: "John",
    location: { x: 10, y: 20 },
    currentLoad: 1,
    maxLoad: 5,
  },
  {
    id: "D2",
    name: "Sarah",
    location: { x: -10, y: 30 },
    currentLoad: 2,
    maxLoad: 3,
  },
  {
    id: "D3",
    name: "Mike",
    location: { x: 5, y: 15 },
    currentLoad: 3,
    maxLoad: 8,
  },
  {
    id: "D4",
    name: "Emily",
    location: { x: -5, y: 25 },
    currentLoad: 9,
    maxLoad: 10,
  },
  {
    id: "D5",
    name: "Alex",
    location: { x: 15, y: 35 },
    currentLoad: 4,
    maxLoad: 7,
  },
  {
    id: "D6",
    name: "Lisa",
    location: { x: -15, y: 10 },
    currentLoad: 2,
    maxLoad: 6,
  },
  {
    id: "D7",
    name: "Ryan",
    location: { x: 8, y: -5 },
    currentLoad: 5,
    maxLoad: 9,
  },
  {
    id: "D8",
    name: "Jessica",
    location: { x: -20, y: 40 },
    currentLoad: 3,
    maxLoad: 8,
  },
];

const initialOrders = [
  {
    id: "O1",
    destination: { x: 50, y: 60 },
    priority: 3,
    customer: "Alice",
  },
  {
    id: "O2",
    destination: { x: 30, y: 40 },
    priority: 1,
    customer: "Bob",
  },
  {
    id: "O3",
    destination: { x: 70, y: 80 },
    priority: 2,
    customer: "Charlie",
  },
  {
    id: "O4",
    destination: { x: 20, y: 50 },
    priority: 2,
    customer: "David",
  },
  {
    id: "O5",
    destination: { x: 55, y: 45 },
    priority: 3,
    customer: "Eve",
  },
  {
    id: "O6",
    destination: { x: 40, y: 30 },
    priority: 1,
    customer: "Frank",
  },
];

const DeliveryCard = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
    <h2 className="font-semibold mb-4 text-xl text-gray-700 flex items-center">
      <Icon className="mr-2" /> {title}
    </h2>
    {children}
  </div>
);

const DeliveryPersonCard = ({ person }) => (
  <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-medium text-gray-700">{person.name}</div>
        <div className="text-sm text-gray-500">ID: {person.id}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-600">
          Load: {person.currentLoad}/{person.maxLoad}
        </div>
        <div className="text-xs text-gray-400">
          ({person.location.x}, {person.location.y})
        </div>
      </div>
    </div>
    <div className="mt-2 bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-500 rounded-full h-2 transition-all"
        style={{ width: `${(person.currentLoad / person.maxLoad) * 100}%` }}
      />
    </div>
  </div>
);

const OrderCard = ({ order, isAssigned = false }) => (
  <div
    className={`mb-4 p-4 ${
      isAssigned ? "bg-green-50" : "bg-gray-50"
    } rounded-lg shadow-sm hover:bg-opacity-80 transition-all`}
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="font-medium text-gray-700">Order {order.id}</div>
        <div className="text-sm text-gray-500">Customer: {order.customer}</div>
      </div>
      <div className="text-right">
        {isAssigned ? (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Assigned to: {order.assignedTo}
          </span>
        ) : (
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              order.priority === 3
                ? "bg-red-100 text-red-800"
                : order.priority === 2
                ? "bg-yellow-100 text-yellow-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Priority {order.priority}
          </span>
        )}
      </div>
    </div>
    <div className="text-xs text-gray-400 mt-2">
      Destination: ({order.destination.x}, {order.destination.y})
    </div>
  </div>
);

const DeliveryOptimizationApp = () => {
  const [deliveryPersons, setDeliveryPersons] = useState(
    initialDeliveryPersons
  );
  const [orders, setOrders] = useState(initialOrders);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
    );
  };

  const assignOrder = () => {
    if (orders.length === 0) return;

    const sortedOrders = [...orders].sort((a, b) => b.priority - a.priority);
    const order = sortedOrders[0];

    const availablePersons = deliveryPersons.filter(
      (person) => person.currentLoad < person.maxLoad
    );

    if (availablePersons.length === 0) {
      alert("All delivery persons are at maximum load!");
      return;
    }

    const bestPerson = availablePersons.reduce((best, current) => {
      const bestDistance = calculateDistance(best.location, order.destination);
      const currentDistance = calculateDistance(
        current.location,
        order.destination
      );
      return currentDistance < bestDistance ? current : best;
    });

    setDeliveryPersons(
      deliveryPersons.map((person) =>
        person.id === bestPerson.id
          ? {
              ...person,
              location: order.destination,
              currentLoad: person.currentLoad + 1,
            }
          : person
      )
    );

    setOrders(orders.filter((o) => o.id !== order.id));
    setAssignedOrders([
      ...assignedOrders,
      { ...order, assignedTo: bestPerson.id },
    ]);
  };

  const filterOrders = (ordersList, query) => {
    if (!query) return ordersList;
    return ordersList.filter(
      (order) =>
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.customer.toLowerCase().includes(query.toLowerCase())
    );
  };

  const filteredPendingOrders = filterOrders(orders, searchQuery);
  const filteredAssignedOrders = filterOrders(assignedOrders, searchQuery);

  const displayOrders =
    searchType === "pending"
      ? filteredPendingOrders
      : searchType === "assigned"
      ? filteredAssignedOrders
      : [...filteredPendingOrders, ...filteredAssignedOrders];

  const getChartData = () => {
    const deliveryData = deliveryPersons.map((person) => ({
      x: person.location.x,
      y: person.location.y,
      label: person.name,
    }));

    const orderData = orders.map((order) => ({
      x: order.destination.x,
      y: order.destination.y,
      label: order.id,
      isHighlighted: order.id.toLowerCase().includes(searchQuery.toLowerCase()),
    }));

    return {
      datasets: [
        {
          label: "Delivery Persons",
          data: deliveryData,
          backgroundColor: "rgba(75, 192, 192, 1)",
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: "Orders",
          data: orderData,
          backgroundColor: orderData.map((order) =>
            order.isHighlighted
              ? "rgba(255, 0, 0, 1)"
              : "rgba(255, 99, 132, 0.5)"
          ),
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Delivery Optimization System
        </h1>

        {/* Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium 
                hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                transition-all cursor-pointer appearance-none"
            >
              <option value="all" className="py-2">
                All Orders
              </option>
              <option value="pending" className="py-2">
                Pending Orders
              </option>
              <option value="assigned" className="py-2">
                Assigned Orders
              </option>
            </select>
          </div>
          <div className="text-sm text-gray-500 mt-4 text-center">
            Found {displayOrders.length} matching orders
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart Section */}
          <DeliveryCard
            title="Location Map"
            icon={MapPin}
            className="lg:col-span-2"
          >
            <div className="bg-white p-4 rounded-lg">
              <Scatter
                data={getChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      type: "linear",
                      position: "bottom",
                      grid: { color: "rgba(0,0,0,0.1)" },
                    },
                    y: {
                      beginAtZero: true,
                      grid: { color: "rgba(0,0,0,0.1)" },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const { dataset, dataIndex } = context;
                          const label =
                            dataset.label === "Delivery Persons"
                              ? deliveryPersons[dataIndex].name
                              : `Order ${orders[dataIndex].id}`;
                          return `${label} (${context.parsed.x}, ${context.parsed.y})`;
                        },
                      },
                    },
                    legend: {
                      position: "top",
                    },
                  },
                }}
                height={350}
              />
            </div>
          </DeliveryCard>

          {/* Delivery Persons Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="font-semibold mb-4 text-xl text-gray-700 flex items-center">
              <Truck className="mr-2" /> Delivery Persons
            </h2>
            <div className="space-y-4">
              {deliveryPersons.map((person) => {
                // 計算工作負載比例
                const loadRatio = person.currentLoad / person.maxLoad;
                // 根據工作負載比例設置進度條顏色
                let progressColor;
                if (loadRatio < 0.5) {
                  progressColor = "bg-green-500"; // 輕載
                } else if (loadRatio < 1) {
                  progressColor = "bg-yellow-500"; // 中載
                } else {
                  progressColor = "bg-red-500"; // 超載
                }

                return (
                  <div
                    key={person.id}
                    className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-700">
                          {person.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {person.id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          Load: {person.currentLoad}/{person.maxLoad}
                        </div>
                        <div className="text-xs text-gray-400">
                          ({person.location.x}, {person.location.y})
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 bg-gray-200 rounded-full h-2">
                      <div
                        className={`${progressColor} rounded-full h-2 transition-all`}
                        style={{
                          width: `${
                            (person.currentLoad / person.maxLoad) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Orders Section */}
          <div className="space-y-8">
            {/* Pending Orders */}
            <DeliveryCard title="Pending Orders" icon={Package}>
              <div className="space-y-4">
                {filteredPendingOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
              <button
                onClick={assignOrder}
                className="w-full mt-6 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={orders.length === 0}
              >
                Assign Next Order
              </button>
            </DeliveryCard>

            {/* Assigned Orders */}
            <DeliveryCard title="Assigned Orders" icon={MapPin}>
              <div className="space-y-4">
                {filteredAssignedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} isAssigned />
                ))}
              </div>
            </DeliveryCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptimizationApp;
