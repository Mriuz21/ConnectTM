import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ref, onValue } from '@firebase/database';
import { database } from './firebaseConfig';
import { useGlobalContext } from './GlobalContext';
import LottieView from 'lottie-react-native';

export default function HistoryPage({ navigation }) {
    const [reports, setReports] = useState([]);
    const { userData } = useGlobalContext();

    useEffect(() => {
        const fetchReports = () => {
            if (userData && userData.email) { //VERIFICARE DACA EXISTA USER DATA
                console.log(userData);
                const userMail = userData.email;
                const reportsRef = ref(database, `issues`);
                onValue(reportsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const reportsList = Object.keys(data).map(id => {
                            if (data[id].email === userMail) { //FILTRARE REPORTS DUPA MAIL
                                return { id, ...data[id] };
                            }
                        }).filter(report => report !== undefined);
                        setReports(reportsList);
                    } else {
                        setReports([]); //DACA N_ARE REPORTURI
                    }
                });
            }
        };

        fetchReports();
    }, [userData]);

    const getStatusColor = (status) => {
        switch(status) {
            case 'Primite':
                return '#0f7ab0';
            case 'In-Lucru':
                return 'orange';
            case 'Rezolvate':
                return 'green';
            default:
                return 'black';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <LottieView
                    source={require('./assets/Animation - 1710020788852.json')}
                    autoPlay
                    loop
                    style={{ width: 50, height: 50, marginRight: 10 }}
                />
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'purple' }}>All Reports</Text>
            </View>
            <FlatList
                data={reports}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.reportItem}>
                        <Text style={styles.reportTitle}>{item.title}</Text>
                        <Text style={styles.reportDescription}>{item.description}</Text>
                        <View
                            style={{
                                ...styles.statusIndicator,
                                backgroundColor: getStatusColor(item.status)
                            }}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
    },
    reportItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reportDescription: {
        fontSize: 16,
    },
    statusIndicator: {
        height: 35,
        width: 35,
        borderRadius: 35,
        position: 'absolute',
        right: 10,
        top: 10,
    },
});
