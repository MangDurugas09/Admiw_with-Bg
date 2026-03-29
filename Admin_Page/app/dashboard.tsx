import React from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  icon: "people" | "attach-money" | "subscriptions" | "receipt";
  color: string;
}

interface QuickActionItem {
  id: string;
  title: string;
  icon: "people" | "receipt" | "subscriptions" | "trending-up" | "dashboard" | "settings";
  route: "/" | "/bills" | "/dashboard";
  color: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "payment" | "subscription" | "update" | "cancellation" | string;
}

export default function Dashboard() {

  const stats: StatItem[] = [
    {
      id: "1",
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: "people",
      color: "#0066CC",
    },
    {
      id: "2",
      title: "Monthly Revenue",
      value: "₱45,230",
      change: "+8%",
      icon: "attach-money",
      color: "#28A745",
    },
    {
      id: "3",
      title: "Active Subscriptions",
      value: "1,429",
      change: "+15%",
      icon: "subscriptions",
      color: "#FFC107",
    },
    {
      id: "4",
      title: "Pending Bills",
      value: "23",
      change: "-5%",
      icon: "receipt",
      color: "#DC3545",
    },
  ];

  const quickActions: QuickActionItem[] = [
    {
      id: "1",
      title: "Manage Users",
      icon: "people",
      route: "/",
      color: "#0066CC",
    },
    {
      id: "2",
      title: "Customer Bills",
      icon: "receipt",
      route: "/bills",
      color: "#28A745",
    },
    {
      id: "3",
      title: "Subscriptions",
      icon: "subscriptions",
      route: "/dashboard",
      color: "#FFC107",
    },
    {
      id: "4",
      title: "Earnings Report",
      icon: "trending-up",
      route: "/dashboard",
      color: "#DC3545",
    },
    {
      id: "5",
      title: "Billing Dashboard",
      icon: "dashboard",
      route: "/bills",
      color: "#6F42C1",
    },
    {
      id: "6",
      title: "Settings",
      icon: "settings",
      route: "/dashboard",
      color: "#6C757D",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      user: "John Doe",
      action: "Paid invoice #INV-2026-001",
      time: "2 minutes ago",
      type: "payment",
    },
    {
      id: "2",
      user: "Jane Smith",
      action: "Subscribed to Premium Plan",
      time: "15 minutes ago",
      type: "subscription",
    },
    {
      id: "3",
      user: "Mike Johnson",
      action: "Updated billing address",
      time: "1 hour ago",
      type: "update",
    },
    {
      id: "4",
      user: "Sarah Wilson",
      action: "Cancelled subscription",
      time: "2 hours ago",
      type: "cancellation",
    },
  ];

  const renderStatCard = ({ item }: { item: StatItem }) => (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        margin: 8,
        width: (width - 48) / 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: `${item.color}20`,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterialIcons name={item.icon} size={24} color={item.color} />
        </View>
        <Text
          style={{
            color: item.change.startsWith("+") ? "#28A745" : "#DC3545",
            fontSize: 12,
            fontWeight: "600",
          }}
        >
          {item.change}
        </Text>
      </View>
      <Text style={{ fontSize: 24, fontWeight: "bold", color: "#333" }}>
        {item.value}
      </Text>
      <Text style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
        {item.title}
      </Text>
    </View>
  );

  const renderQuickAction = ({ item }: { item: QuickActionItem }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        margin: 8,
        width: (width - 48) / 2,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => router.push(item.route)}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: `${item.color}20`,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <MaterialIcons name={item.icon} size={28} color={item.color} />
      </View>
      <Text
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: "#333",
          textAlign: "center",
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderActivity = ({ item }: { item: ActivityItem }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: "#E6F4FE",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 12,
        }}
      >
        <MaterialIcons
          name={
            item.type === "payment"
              ? "payment"
              : item.type === "subscription"
              ? "subscriptions"
              : item.type === "update"
              ? "edit"
              : "cancel"
          }
          size={20}
          color="#0066CC"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>
          {item.user}
        </Text>
        <Text style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
          {item.action}
        </Text>
      </View>
      <Text style={{ fontSize: 12, color: "#999" }}>{item.time}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      {/* Header with Image Background */}
      <View style={{ position: "relative", height: 120 }}>
        <Image
          source={{
            uri: "https://d1ththk5stqb83.cloudfront.net/Main/Pages/Industry+Videos/Thumbnails/Power+Generation.jpg",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
          }}
          resizeMode="cover"
        />
        {/* Dark Overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          }}
        />
        {/* Header Content */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingTop: 50,
            paddingBottom: 20,
            paddingHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
              ADMIN Dashboard
            </Text>
            <Text style={{ fontSize: 14, color: "#E6F4FE", marginTop: 4 }}>
              Welcome back, Admin
            </Text>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => router.push("/")}
          >
            <MaterialIcons name="person" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Stats Cards */}
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 16,
            }}
          >
            Overview
          </Text>
          <FlatList
            data={stats}
            renderItem={renderStatCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            columnWrapperStyle={{ justifyContent: "center" }}
          />
        </View>

        {/* Quick Actions */}
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 16,
            }}
          >
            Quick Actions
          </Text>
          <FlatList
            data={quickActions}
            renderItem={renderQuickAction}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            columnWrapperStyle={{ justifyContent: "center" }}
          />
        </View>

        {/* Recent Activities */}
        <View style={{ padding: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
              }}
            >
              Recent Activities
            </Text>
            <TouchableOpacity>
              <Text style={{ color: "#0066CC", fontSize: 14, fontWeight: "600" }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentActivities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}