import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import Header from '@/components/Header';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ActivityDetail = () => {
    const { name, organization } = useLocalSearchParams();

    const description = "Join us in making a difference by participating in this volunteering activity. Your support can create a significant impact!";
    const purpose = "To engage the community in meaningful volunteer work and create a positive impact.";
    const role = "Volunteer - Assisting in event coordination and support.";
    const vibe = "Friendly, Engaging, and Impactful.";
    const venue = "City Park Community Center";
    const city = "Karachi";
    const timing = "10:00 AM - 2:00 PM";
    const date = "Saturday, Mar 8, 2025";
    const timeRange = "11:45 AM - 2:15 PM";
    const rating = 4.5;

    return (
        <View style={styles.screen}>
            <ScrollView>
                <Header title={name} mb={30} />
                <View style={styles.container}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.subtitle}>Organized by: {organization}</Text>

                    <View style={styles.card}><Text style={styles.sectionTitle}>Description</Text><Text style={styles.text}>{description}</Text></View>
                    <View style={styles.card}><Text style={styles.sectionTitle}>Purpose</Text><Text style={styles.text}>{purpose}</Text></View>
                    <View style={styles.card}><Text style={styles.sectionTitle}>Role</Text><Text style={styles.text}>{role}</Text></View>
                    <View style={styles.card}><Text style={styles.sectionTitle}>Vibe</Text><Text style={styles.text}>{vibe}</Text></View>
                </View>
            </ScrollView>
            
            <View style={styles.fixedBottom}>
                <View style={styles.dateContainer}>
                    <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primaryLight} />
                    <Text style={styles.dateText}>Date and Time</Text>
                </View>
                <Text style={styles.dateText}>{date}</Text>
                <Text style={styles.dateText}>{timeRange}</Text>
                
                <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, index) => (
                        <MaterialCommunityIcons 
                            key={index} 
                            name={index < rating ? "star" : "star-outline"} 
                            size={24} 
                            color={theme.colors.accent} 
                        />
                    ))}
                </View>
                
                <Pressable style={[styles.signupButton, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.signupText}>Sign Up</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default ActivityDetail;

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: wp(4), paddingVertical: wp(4) },
    container: { flex: 1, paddingTop: hp(2), alignItems: 'center' },
    title: { fontSize: hp(3.5), fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center' },
    subtitle: { fontSize: hp(2), color: theme.colors.secondary, marginBottom: hp(3), textAlign: 'center' },
    card: { backgroundColor: theme.colors.cardBackground, padding: hp(2), borderRadius: theme.radius.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, marginBottom: hp(2), width: '100%' },
    sectionTitle: { fontSize: hp(2.2), fontWeight: 'bold', color: theme.colors.primaryDark, marginBottom: hp(1) },
    text: { fontSize: hp(1.9), color: theme.colors.text },
    fixedBottom: { padding: 15, borderTopWidth: 1, borderColor: theme.colors.border, alignItems: "center", backgroundColor: 'rgba(128, 128, 128, 0.5)' },
    dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    dateText: { fontSize: 16, color: theme.colors.primaryLight, marginBottom: 5, textAlign: 'center' },
    ratingContainer: { flexDirection: 'row', marginBottom: 10 },
    signupButton: { marginTop: 10, padding: 12, borderRadius: 8, width: "80%", alignItems: "center" },
    signupText: { fontSize: 16, fontWeight: "bold", color: theme.colors.buttonText }
});
