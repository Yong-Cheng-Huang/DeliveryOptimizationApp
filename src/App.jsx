import React, { useState, useEffect } from "react";
import { MapPin, Truck, Package, Search } from "lucide-react";

const initialDeliveryPersons = [
  {
    id: "D1",
    name: "John",
    location: { x: 10, y: 20 },
    currentLoad: 3,
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

    setOrders(orders.filter((o) => o.id !== order.id));
    setAssignedOrders([
      ...assignedOrders,
      { ...order, assignedTo: bestPerson.id },
    ]);

    setDeliveryPersons(
      deliveryPersons.map((person) =>
        person.id === bestPerson.id
          ? { ...person, currentLoad: person.currentLoad + 1 }
          : person
      )
    );
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

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Delivery Optimization System
      </h1>

      {/* Search Section */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by Order ID or Customer Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Orders</option>
            <option value="assigned">Assigned Orders</option>
          </select>
        </div>
        <div className="text-sm text-gray-500 mt-4 flex items-center justify-center">
          Found {displayOrders.length} matching orders
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Delivery Persons */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4 text-xl text-gray-700 flex items-center">
            <Truck className="mr-2" /> Delivery Persons
          </h2>
          {deliveryPersons.map((person) => (
            <div
              key={person.id}
              className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">
                  {person.name} - {person.id}
                </span>
                <span className="text-sm text-gray-500">
                  Load: {person.currentLoad}/{person.maxLoad}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Location: ({person.location.x}, {person.location.y})
              </div>
            </div>
          ))}
        </div>

        {/* Pending Orders */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4 text-xl text-gray-700 flex items-center">
            <Package className="mr-2" /> Pending Orders
          </h2>
          {filteredPendingOrders.map((order) => (
            <div
              key={order.id}
              className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Order {order.id}</span>
                <span className="text-sm text-gray-500">
                  Priority: {order.priority}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Customer: {order.customer}
              </div>
              <div className="text-sm text-gray-400">
                Destination: ({order.destination.x}, {order.destination.y})
              </div>
            </div>
          ))}
          <button
            onClick={assignOrder}
            className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
            disabled={orders.length === 0}
          >
            Assign Next Order
          </button>
        </div>

        {/* Assigned Orders */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="font-semibold mb-4 text-xl text-gray-700 flex items-center">
            <MapPin className="mr-2" /> Assigned Orders
          </h2>
          {filteredAssignedOrders.map((order) => (
            <div
              key={order.id}
              className="mb-4 p-4 bg-green-50 rounded-lg shadow-sm"
            >
              <div className="flex justify-between text-gray-700">
                <span className="font-medium">Order {order.id}</span>
                <span className="text-sm text-gray-500">
                  Assigned to: {order.assignedTo}
                </span>
              </div>
              <div className="text-sm text-gray-400 mt-1">
                Customer: {order.customer}
              </div>
              <div className="text-sm text-gray-400">
                Destination: ({order.destination.x}, {order.destination.y})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptimizationApp;
