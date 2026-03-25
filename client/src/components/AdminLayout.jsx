import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  background-color: #121214;
  min-height: 100vh;
  width: 100vw;
  font-family: 'Lexend', sans-serif;
  overflow-x: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 260px;
  margin-top: 60px;
  padding: 2.5rem;
  background-color: #161618;
  color: #fff;
  min-height: calc(100vh - 60px);
`;

const AdminLayout = ({ children }) => {
    return (
        <LayoutContainer>
            <Sidebar />
            <Header />
            <MainContent>{children}</MainContent>
        </LayoutContainer>
    );
};

export default AdminLayout;
