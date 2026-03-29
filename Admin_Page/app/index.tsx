import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Index() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: security question, 3: reset
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [userSecurityQuestion, setUserSecurityQuestion] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async () => {
    try {
      resetMessages();

      // Validation
      if (!email || !password) {
        setError("Please fill in all required fields");
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("✓ Login successful:", { email, rememberMe });
      
      setSuccess("Login successful! Redirecting to dashboard...");
      
      // Small delay to show success message
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      router.push("/dashboard");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Login failed: ${error}. Please try again.`);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      resetMessages();

      // Validation
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError("Please fill in all required fields");
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      if (firstName.length < 2) {
        setError("First name must be at least 2 characters long");
        return;
      }

      if (lastName.length < 2) {
        setError("Last name must be at least 2 characters long");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("✓ Signup successful:", { firstName, lastName, email });

      setSuccess("Account created successfully! Please log in.");
      
      // Clear form and switch to login
      setIsLogin(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Signup failed: ${error}. Please try again.`);
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotPasswordStep(1);
    setError("");
    setSuccess("");
  };

  const handleForgotPasswordEmail = async () => {
    try {
      if (!email) {
        setError("Please enter your email address");
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address");
        return;
      }

      setLoading(true);
      resetMessages();

      // Simulate checking if user exists and getting security question
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - in real app, this would come from API
      const mockUserData = {
        "admin@example.com": {
          securityQuestion: "What was the name of your first pet?",
          securityAnswer: "fluffy"
        },
        "john.doe@example.com": {
          securityQuestion: "What city were you born in?",
          securityAnswer: "new york"
        }
      };

      const userData = mockUserData[email as keyof typeof mockUserData];

      if (!userData) {
        setError("No account found with this email address");
        return;
      }

      setUserSecurityQuestion(userData.securityQuestion);
      setForgotPasswordStep(2);
    } catch (err) {
      const error = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Failed to process request: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityQuestion = async () => {
    try {
      if (!securityAnswer.trim()) {
        setError("Please provide an answer to the security question");
        return;
      }

      setLoading(true);
      resetMessages();

      // Simulate verifying security answer
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock verification - in real app, this would verify against stored answer
      const mockAnswers = {
        "admin@example.com": "fluffy",
        "john.doe@example.com": "new york"
      };

      const correctAnswer = mockAnswers[email as keyof typeof mockAnswers];

      if (securityAnswer.toLowerCase().trim() !== correctAnswer) {
        setError("Incorrect answer to security question");
        return;
      }

      setForgotPasswordStep(3);
    } catch (err) {
      const error = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Verification failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    try {
      if (!newPassword || !confirmNewPassword) {
        setError("Please fill in all password fields");
        return;
      }

      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match");
        return;
      }

      setLoading(true);
      resetMessages();

      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess("Password reset successfully! You can now log in with your new password.");
      setShowForgotPassword(false);
      setForgotPasswordStep(1);
      setSecurityAnswer("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Password reset failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep(1);
    setError("");
    setSuccess("");
    setSecurityAnswer("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleContactSupport = async () => {
    try {
      setLoading(true);
      resetMessages();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.log("✓ Support request submitted");

      setSuccess("Support team will contact you shortly. Check your email for confirmation.");
    } catch (err) {
      const error = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(`Could not submit support request: ${error}`);
      console.error("Support request error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {/* Image Background */}
      <Image
        source={{
          uri: "https://d1ththk5stqb83.cloudfront.net/Main/Pages/Industry+Videos/Thumbnails/Power+Generation.jpg",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          zIndex: 0,
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
          bottom: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, zIndex: 2 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "#09ccf8",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <MaterialIcons name="admin-panel-settings" size={40} color="white" />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "white",
              marginBottom: 8,
            }}
          >
          ADMIN PORTAL
          </Text>
          <Text style={{ fontSize: 14, color: "#E6F4FE", textAlign: "center" }}>
            {isLogin
              ? "Sign in to access your admin dashboard"
              : "Create an account to get started"}
          </Text>
        </View>

        {error ? (
          <View
            style={{
              backgroundColor: "#ffe6e6",
              borderLeftWidth: 4,
              borderLeftColor: "#CC0000",
              padding: 12,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#CC0000", fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View
            style={{
              backgroundColor: "#E6F2E6",
              borderLeftWidth: 4,
              borderLeftColor: "#2E8B57",
              padding: 12,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#2E8B57", fontSize: 14 }}>{success}</Text>
          </View>
        ) : null}

        {!isLogin && (
          <>
            <View style={{ marginBottom: 14 }}>
              <Text style={{ color: "white", fontWeight: "600", marginBottom: 6 }}>
                First Name
              </Text>
              <TextInput
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
                placeholderTextColor="#62676ab3"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#0066CC",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  color: "#333333",
                }}
              />
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={{ color: "white", fontWeight: "600", marginBottom: 6 }}>
                Last Name
              </Text>
              <TextInput
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
                placeholderTextColor="#62676ab3"
                style={{
                  borderWidth: 1.5,
                  borderColor: "#0066CC",
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  color: "#333333",
                }}
              />
            </View>
          </>
        )}

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: "white", fontWeight: "600", marginBottom: 6 }}>
            Email Address
          </Text>
          <TextInput
            placeholder="admin@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
            placeholderTextColor="#62676ab3"
            style={{
              borderWidth: 1.5,
              borderColor: "#0066CC",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "#333333",
            }}
          />
        </View>

        <View style={{ marginBottom: 14 }}>
          <Text style={{ color: "white", fontWeight: "600", marginBottom: 6 }}>
            Password
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: "#0066CC",
              borderRadius: 8,
              paddingHorizontal: 12,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
            }}
          >
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
              placeholderTextColor="#62676ab3"
              style={{ flex: 1, paddingVertical: 12, color: "#333333" }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={loading}>
              <MaterialIcons
                name={showPassword ? "visibility-off" : "visibility"}
                size={24}
                color="#0066CC"
              />
            </TouchableOpacity>
          </View>
        </View>

        {!isLogin && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: "white", fontWeight: "600", marginBottom: 6 }}>
              Confirm Password
            </Text>
            <TextInput
              placeholder="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
              placeholderTextColor="#62676ab3"
              style={{
                borderWidth: 1.5,
                borderColor: "#0066CC",
                borderRadius: 8,
                paddingHorizontal: 16,
                paddingVertical: 12,
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                color: "#333333",
              }}
            />
          </View>
        )}

        {isLogin ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={{ flexDirection: "row", alignItems: "center" }}
              disabled={loading}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderWidth: 1.5,
                  borderColor: "#0066CC",
                  borderRadius: 4,
                  marginRight: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: rememberMe ? "#0066CC" : "rgba(255, 255, 255, 0.2)",
                }}
              >
                {rememberMe && <MaterialIcons name="check" size={14} color="white" />}
              </View>
              <Text style={{ color: "white", fontSize: 14 }}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity disabled={loading} onPress={handleForgotPassword}>
              <Text style={{ color: "#B3D9F2", fontSize: 14, fontWeight: "500" }}>
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={isLogin ? handleLogin : handleSignup}
          disabled={loading}
          style={{
            backgroundColor: loading ? "#4D99E6" : "#0066CC",
            paddingVertical: 14,
            borderRadius: 8,
            marginBottom: 16,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
              {isLogin ? "Sign In" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
          <Text style={{ color: "#E6F4FE", fontSize: 14 }}>
            {isLogin ? "Don’t have an account? " : "Already have an account? "}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setError("");
              setSuccess("");
              setIsLogin(!isLogin);
            }}
            disabled={loading}
          >
            <Text style={{ color: "#B3D9F2", fontWeight: "600", fontSize: 14 }}>
              {isLogin ? "Sign Up" : "Sign In"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", marginTop: 10 }}>
          <TouchableOpacity onPress={handleContactSupport} disabled={loading}>
            <Text style={{ color: "#E6F4FE", fontSize: 13 }}>
              Having trouble?{
                " "}
              <Text style={{ color: "#B3D9F2", fontWeight: "600" }}>Contact Support</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "rgba(179, 217, 242, 0.3)",
            marginTop: 24,
            paddingTop: 16,
          }}
        >
          <Text style={{ color: "#999999", fontSize: 12, textAlign: "center" }}>
            © 2026 Admin Portal. All rights reserved.
          </Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        animationType="slide"
        transparent={true}
        onRequestClose={closeForgotPassword}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 24,
              width: "100%",
              maxWidth: 400,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            {/* Modal Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#333",
                }}
              >
                Reset Password
              </Text>
              <TouchableOpacity onPress={closeForgotPassword}>
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              {[1, 2, 3].map((step) => (
                <View
                  key={step}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      backgroundColor:
                        step <= forgotPasswordStep ? "#0066CC" : "#E0E0E0",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: step <= forgotPasswordStep ? "white" : "#666",
                        fontWeight: "bold",
                      }}
                    >
                      {step}
                    </Text>
                  </View>
                  {step < 3 && (
                    <View
                      style={{
                        width: 40,
                        height: 2,
                        backgroundColor:
                          step < forgotPasswordStep ? "#0066CC" : "#E0E0E0",
                        marginHorizontal: 8,
                      }}
                    />
                  )}
                </View>
              ))}
            </View>

            {/* Error/Success Messages */}
            {error ? (
              <View
                style={{
                  backgroundColor: "#FFE6E6",
                  borderLeftWidth: 4,
                  borderLeftColor: "#CC0000",
                  padding: 12,
                  borderRadius: 6,
                  marginBottom: 16,
                }}
              >
                <Text style={{ color: "#CC0000", fontSize: 14 }}>{error}</Text>
              </View>
            ) : null}

            {/* Step 1: Email Verification */}
            {forgotPasswordStep === 1 && (
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#666",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  Enter your email address to reset your password
                </Text>
                <TextInput
                  placeholder="admin@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  editable={!loading}
                  placeholderTextColor="#999999"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#B3D9F2",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "white",
                    color: "#333333",
                    marginBottom: 20,
                  }}
                />
                <TouchableOpacity
                  onPress={handleForgotPasswordEmail}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#4D99E6" : "#0066CC",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                      Continue
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Security Question */}
            {forgotPasswordStep === 2 && (
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#666",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  Answer your security question
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "#333",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {userSecurityQuestion}
                </Text>
                <TextInput
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChangeText={setSecurityAnswer}
                  editable={!loading}
                  placeholderTextColor="#999999"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#B3D9F2",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "white",
                    color: "#333333",
                    marginBottom: 20,
                  }}
                />
                <TouchableOpacity
                  onPress={handleSecurityQuestion}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#4D99E6" : "#0066CC",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                      Verify Answer
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setForgotPasswordStep(1)}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#0066CC", fontSize: 14 }}>
                    ← Back to Email
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Password Reset */}
            {forgotPasswordStep === 3 && (
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#666",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  Create your new password
                </Text>
                <TextInput
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                  editable={!loading}
                  placeholderTextColor="#999999"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#B3D9F2",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "white",
                    color: "#333333",
                    marginBottom: 12,
                  }}
                />
                <TextInput
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry={true}
                  editable={!loading}
                  placeholderTextColor="#999999"
                  style={{
                    borderWidth: 1.5,
                    borderColor: "#B3D9F2",
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    backgroundColor: "white",
                    color: "#333333",
                    marginBottom: 20,
                  }}
                />
                <TouchableOpacity
                  onPress={handlePasswordReset}
                  disabled={loading}
                  style={{
                    backgroundColor: loading ? "#4D99E6" : "#28A745",
                    paddingVertical: 14,
                    borderRadius: 8,
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                      Reset Password
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setForgotPasswordStep(2)}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#0066CC", fontSize: 14 }}>
                    ← Back to Security Question
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

