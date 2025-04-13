import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useRouter } from 'expo-router';
import { wp, hp } from '@/helper/common';
import { theme } from '@/constants/theme';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '@/components/Header';

const PostActivity = () => {
    const router = useRouter();
    const [activityName, setActivityName] = useState('');
    const [description, setDescription] = useState('');
    const [role, setRole] = useState('');
    const [volunteersRequired, setVolunteersRequired] = useState('');
    const [venue, setVenue] = useState('');
    const [city, setCity] = useState('Karachi');
    const [status, setStatus] = useState('Open');
    
    // Date & Time States
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    const handlePostActivity = () => {
        if (!activityName.trim() || !description.trim() || !role.trim() || !volunteersRequired.trim() || !venue.trim()) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        if (startTime >= endTime) {
            Alert.alert('Error', 'End time must be later than start time.');
            return;
        }

        // Simulate posting the activity (Replace with API call)
        const newActivity = {
            id: Math.floor(Math.random() * 1000),
            name: activityName,
            description: description,
            role: role,
            volunteersRequired: parseInt(volunteersRequired),
            venue: venue,
            city: city,
            status: status,
            date: date.toISOString().split('T')[0],
            startTime: startTime.toLocaleTimeString(),
            endTime: endTime.toLocaleTimeString(),
        };

        Alert.alert('Success', 'Activity posted successfully!', [
            { text: 'OK', onPress: () => router.push('/home2') }
        ]);

        console.log('Posted Activity:', newActivity);
    };

    return (
        <View style={styles.container}>
            <ScreenWrapper>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Header title="Post an Activity" mb={30} />

                    <Text style={styles.label}>Activity Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter activity name"
                        value={activityName}
                        onChangeText={setActivityName}
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter activity description"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                    />

                    <Text style={styles.label}>Role</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter role (e.g., Organizer, Team Leader)"
                        value={role}
                        onChangeText={setRole}
                    />

                    <Text style={styles.label}>Volunteers Required</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of volunteers"
                        value={volunteersRequired}
                        onChangeText={setVolunteersRequired}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Venue</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter venue"
                        value={venue}
                        onChangeText={setVenue}
                    />

                    <Text style={styles.label}>City</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={city}
                            onValueChange={(itemValue) => setCity(itemValue)}
                            style={{color: theme.colors.text}}
                        >
                            <Picker.Item label="Karachi" value="Karachi" />
                            <Picker.Item label="Lahore" value="Lahore" />
                            <Picker.Item label="Islamabad" value="Islamabad" />
                            <Picker.Item label="Rawalpindi" value="Rawalpindi" />
                            <Picker.Item label="Peshawar" value="Peshawar" />
                            <Picker.Item label="Quetta" value="Quetta" />
                            <Picker.Item label="Multan" value="Multan" />
                            <Picker.Item label="Faisalabad" value="Faisalabad" />
                            <Picker.Item label="Hyderabad" value="Hyderabad" />
                            <Picker.Item label="Sialkot" value="Sialkot" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={status}
                            onValueChange={(itemValue) => setStatus(itemValue)}
                            style={{color: theme.colors.text}}
                        >
                            <Picker.Item label="Open (Accepting Volunteers)" value="Open" />
                            <Picker.Item label="Full (Maximum Capacity)" value="Full" />
                            <Picker.Item label="Closed (Registration Ended)" value="Closed" />
                            <Picker.Item label="Cancelled" value="Cancelled" />
                            <Picker.Item label="Completed" value="Completed" />
                        </Picker>
                    </View>

                    {/* Date Picker */}
                    <Text style={styles.label}>Select Date</Text>
                    <Pressable onPress={() => setShowDatePicker(true)} style={styles.input}>
                        <Text>{date.toDateString()}</Text>
                    </Pressable>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) setDate(selectedDate);
                            }}
                        />
                    )}

                    {/* Start Time Picker */}
                    <Text style={styles.label}>Start Time</Text>
                    <Pressable onPress={() => setShowStartTimePicker(true)} style={styles.input}>
                        <Text>{startTime.toLocaleTimeString()}</Text>
                    </Pressable>
                    {showStartTimePicker && (
                        <DateTimePicker
                            value={startTime}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                setShowStartTimePicker(false);
                                if (selectedTime) setStartTime(selectedTime);
                            }}
                        />
                    )}

                    {/* End Time Picker */}
                    <Text style={styles.label}>End Time</Text>
                    <Pressable onPress={() => setShowEndTimePicker(true)} style={styles.input}>
                        <Text>{endTime.toLocaleTimeString()}</Text>
                    </Pressable>
                    {showEndTimePicker && (
                        <DateTimePicker
                            value={endTime}
                            mode="time"
                            display="default"
                            onChange={(event, selectedTime) => {
                                setShowEndTimePicker(false);
                                if (selectedTime) setEndTime(selectedTime);
                            }}
                        />
                    )}

                    <Pressable style={styles.postButton} onPress={handlePostActivity}>
                        <Text style={styles.postButtonText}>Post Activity</Text>
                    </Pressable>
                </ScrollView>
            </ScreenWrapper>
        </View>
    );
};

export default PostActivity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: wp(4)
    },
    title: {
        fontSize: hp(3),
        fontWeight: 'bold',
        color: theme.colors.text,
        marginBottom: hp(2),
        textAlign: 'center',
    },
    label: {
        fontSize: hp(2),
        fontWeight: '600',
        color: theme.colors.text,
        marginTop: hp(1.5),
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderRadius: theme.radius.sm,
        paddingVertical: hp(1.2),
        paddingHorizontal: wp(4),
        fontSize: hp(2),
        color: theme.colors.text,
        marginTop: hp(1),
    },
    textArea: {
        height: hp(10),
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: theme.colors.gray,
        borderRadius: theme.radius.sm,
        marginTop: hp(1),
    },
    postButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: hp(1.5),
        borderRadius: theme.radius.md,
        marginTop: hp(3),
        marginBottom: hp(3),
        alignItems: 'center',
    },
    postButtonText: {
        color: '#FFFFFF',
        fontSize: hp(2),
        fontWeight: 'bold',
    },
});
