import { useState, useEffect } from "react";
import { Package, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState([
    {
      title: "Total Products",
      value: "0",
      icon: <Package className="h-6 w-6 text-primary-foreground" />,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Low Stock Items",
      value: "0",
      icon: <AlertTriangle className="h-6 w-6 text-primary-foreground" />,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Total Value",
      value: "$0",
      icon: <DollarSign className="h-6 w-6 text-primary-foreground" />,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Out of Stock",
      value: "0",
      icon: <TrendingDown className="h-6 w-6 text-primary-foreground" />,
      trend: { value: 0, isPositive: true },
    },
  ]);

  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/items');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // Update stats
        const items = data.items || [];
        const totalProducts = items.length;
        const lowStockItems = items.filter(item => item.quantity < 10).length;
        const outOfStock = items.filter(item => item.quantity === 0).length;
        const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        setStats([
          {
            title: "Total Products",
            value: totalProducts.toString(),
            icon: <Package className="h-6 w-6 text-primary-foreground" />,
            trend: { value: 0, isPositive: true },
          },
          {
            title: "Low Stock Items",
            value: lowStockItems.toString(),
            icon: <AlertTriangle className="h-6 w-6 text-primary-foreground" />,
            trend: { value: 0, isPositive: false },
          },
          {
            title: "Total Value",
            value: `$${totalValue.toFixed(2)}`,
            icon: <DollarSign className="h-6 w-6 text-primary-foreground" />,
            trend: { value: 0, isPositive: true },
          },
          {
            title: "Out of Stock",
            value: outOfStock.toString(),
            icon: <TrendingDown className="h-6 w-6 text-primary-foreground" />,
            trend: { value: 0, isPositive: false },
          },
        ]);

        // Update inventory data
        const categoryData = items.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = 0;
          }
          acc[item.category] += item.quantity;
          return acc;
        }, {});

        setInventoryData(Object.entries(categoryData).map(([name, value]) => ({
          name,
          value,
        })));
      } catch (error) {
        toast.error('Failed to fetch inventory data');
        console.error('Error:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const monthlyData = [
    { month: "Jan", products: 400 },
    { month: "Feb", products: 450 },
    { month: "Mar", products: 520 },
    { month: "Apr", products: 480 },
    { month: "May", products: 600 },
    { month: "Jun", products: 650 },
  ];

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Overview of your inventory management system
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 gradient-card">
          <h3 className="text-lg font-semibold mb-4">Monthly Inventory Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-sm" />
              <YAxis className="text-sm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Bar dataKey="products" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 gradient-card">
          <h3 className="text-lg font-semibold mb-4">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
