import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface Props {
    size: number;
    color: string;
    style?: any;
}
export const Search: React.FC<Props> = ({size, color, style}) => {
    return(
        <Ionicons name="search-outline" size={size} color={color} style={style} />
    )
}
export const FilterList: React.FC<Props> = ({size, color, style}) => {
    return(
      <Ionicons name="filter-outline" size={size} color={color} style={style} />
    )
}
export const RestartAlt: React.FC<Props> = ({size, color, style}) => {
    return(
     <Ionicons name="reload-outline" size={size} color={color} style={style} />
    )
}