import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileHeader = ({ user }) => {
    if (!user) return null;

    return (
        <View style={styles.profileHeader}>
            <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.joinDate}>{user.joinDate}</Text>
            <View style={styles.levelContainer}>
                <Text style={styles.levelText}>Level {user.level}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    joinDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    levelContainer: {
        marginTop: 10,
        backgroundColor: '#eaf5ff',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#005bb5',
    },
});

export default ProfileHeader;
