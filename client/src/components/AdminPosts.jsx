import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsSearch, BsFilter, BsPlus, BsEye, BsPencil, BsTrash, BsCheck } from 'react-icons/bs';
import AdminLayout from './AdminLayout';
import api from '../services/api';

const PageHeader = styled.div`
  margin-bottom: 2rem;
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-text-strong);
    margin-bottom: 0.5rem;
  }
  p {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
`;

const Container = styled.div`
  background-color: var(--color-bg-card);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
`;

const TableHeaderLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const SearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 12px;
    color: var(--color-input-placeholder);
    font-size: 0.9rem;
  }

  input {
    background: var(--color-input-bg);
    border: 1px solid var(--color-input-border);
    color: var(--color-input-text);
    padding: 0.5rem 1rem 0.5rem 2.2rem;
    border-radius: 8px;
    font-size: 0.85rem;
    outline: none;
    width: 220px;
    transition: border-color 0.2s;

    ::placeholder {
      color: var(--color-input-placeholder);
    }

    &:focus {
      border-color: var(--color-input-focus-border);
    }
  }
`;

const FilterBtn = styled.button`
  background: var(--color-input-bg);
  border: 1px solid var(--color-input-border);
  color: var(--color-input-text);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: var(--color-panel-strong);
  }
`;

const AddBtn = styled.button`
  background: linear-gradient(135deg, #8b5cf6, #5b45c2);
  border: none;
  color: var(--color-text-strong);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--color-table-divider);
  }
  
  th {
    color: var(--color-table-head);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-bottom: 1.2rem;
  }

  tbody tr {
    transition: background-color 0.2s;
    
    &:hover {
      background-color: var(--color-table-row-hover);
    }
    
    &:last-child td {
      border-bottom: none;
    }
  }
`;

const CheckboxBase = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid ${props => props.checked ? 'var(--color-accent)' : 'var(--color-input-border)'};
  background-color: ${props => props.checked ? 'var(--color-accent)' : 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  
  svg {
    color: var(--color-text-strong);
    font-size: 12px;
    opacity: ${props => props.checked ? 1 : 0};
  }
`;

const CustomCheckbox = ({ checked, onChange }) => (
  <CheckboxBase checked={checked} onClick={onChange}>
    <BsCheck strokeWidth={1} />
  </CheckboxBase>
);

const PostTitleCol = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  .thumb {
    width: 44px;
    height: 32px;
    border-radius: 6px;
    object-fit: cover;
  }

  .info {
    .title {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin-bottom: 0.2rem;
    }
    .excerpt {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }
  }
`;

const AuthorCol = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-accent);
    color: var(--color-text-strong);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.65rem;
    font-weight: bold;
  }
  
  span {
    font-size: 0.85rem;
    color: var(--color-text-primary);
  }
`;

const Badge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  background-color: ${props => {
    switch (props.type) {
      case 'Dev': return 'rgba(59, 130, 246, 0.15)';
      case 'Design': return 'rgba(139, 92, 246, 0.15)';
      case 'System': return 'rgba(16, 185, 129, 0.15)';
      default: return 'var(--color-border)';
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'Dev': return '#60a5fa';
      case 'Design': return '#a78bfa';
      case 'System': return '#34d399';
      default: return 'var(--color-text-muted)';
    }
  }};
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;

  background-color: ${props => {
    switch (props.status) {
      case 'Published': return 'rgba(16, 185, 129, 0.1)';
      case 'Draft': return 'rgba(245, 158, 11, 0.1)';
      case 'Scheduled': return 'rgba(59, 130, 246, 0.1)';
      default: return 'transparent';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'Published': return '#34d399';
      case 'Draft': return '#fbbf24';
      case 'Scheduled': return '#60a5fa';
      default: return 'var(--color-text-strong)';
    }
  }};

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${props => {
    switch (props.status) {
      case 'Published': return '#34d399';
      case 'Draft': return '#fbbf24';
      case 'Scheduled': return '#60a5fa';
      default: return 'var(--color-text-strong)';
    }
  }};
  }
`;

const ActionIcons = styled.div`
  display: flex;
  gap: 0.8rem;
  
  svg {
    color: var(--color-text-muted);
    font-size: 0.95rem;
    cursor: pointer;
    transition: color 0.2s;
    
    &:hover {
      color: var(--color-text-primary);
    }
    
    &.delete:hover {
      color: #ef4444;
    }
  }
`;

const PaginationRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-table-divider);
  
  .info {
    color: var(--color-text-muted);
    font-size: 0.8rem;
  }
  
  .pages {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    
    button {
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-size: 0.8rem;
      cursor: pointer;
      padding: 0.4rem 0.6rem;
      border-radius: 4px;
      
      &:hover {
        color: var(--color-text-primary);
      }
      
      &.circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        
        &.active {
          border: 1px solid var(--color-accent);
          color: var(--color-text-strong);
        }
        
        &:hover {
          background-color: var(--color-table-row-hover);
        }
      }
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: opacity 0.2s;
`;

const ModalContent = styled.div`
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  padding: 2rem;
  transform: translateY(${props => props.show ? '0' : '20px'});
  transition: transform 0.2s;

  h3 {
    color: var(--color-text-strong);
    margin-bottom: 1.5rem;
    font-size: 1.4rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  
  label {
    display: block;
    color: var(--color-text-muted);
    font-size: 0.85rem;
    margin-bottom: 0.5rem;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 0.8rem;
    background: var(--color-input-bg);
    border: 1px solid var(--color-input-border);
    color: var(--color-input-text);
    border-radius: 8px;
    font-size: 0.9rem;
    outline: none;
    
    &:focus {
      border-color: var(--color-input-focus-border);
    }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  button {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
  }
  
  .cancel {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text-strong);
    &:hover { background: var(--color-panel-strong); }
  }
  
  .save {
    background: linear-gradient(135deg, #8b5cf6, #5b45c2);
    border: none;
    color: var(--color-text-strong);
    &:hover { opacity: 0.9; }
  }
`;

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', excerpt: '', category: 'Dev', status: 'Draft' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/projects');
      const formatted = res.data.map(p => ({
        id: p.id,
        title: p.title,
        excerpt: p.description,
        author: p.author || 'Mark Ashton',
        category: p.category || 'Dev',
        status: p.status || 'Draft',
        date: new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        img: p.cover_image_url || '/images/brand/622047349_18093429652785842_4049560783245987396_n.jpg'
      }));
      setPosts(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleAll = () => {
    if (selected.length === posts.length) setSelected([]);
    else setSelected(posts.map(p => p.id));
  };

  const toggleOne = (id) => {
    if (selected.includes(id)) setSelected(selected.filter(i => i !== id));
    else setSelected([...selected, id]);
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        title: formData.title,
        description: formData.excerpt,
        category: formData.category,
        status: formData.status,
        author: 'Mark Ashton',
        cover_image_url: '/images/brand/622453272_18067438643216108_4690090718937568057_n.jpg'
      });
      fetchPosts();
      setShowModal(false);
      setFormData({ title: '', excerpt: '', category: 'Dev', status: 'Draft' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchPosts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <AdminLayout>
      <PageHeader>
        <h1>Posts22</h1>
        <p>Manage your blog content and articles</p>
      </PageHeader>

      <Container>
        <TableHeaderLine>
          <h2>Post Management</h2>
          <ActionsContainer>
            <SearchBox>
              <BsSearch />
              <input type="text" placeholder="Search posts..." />
            </SearchBox>
            <FilterBtn>
              <BsFilter /> Filter
            </FilterBtn>
            <AddBtn onClick={() => setShowModal(true)}>
              <BsPlus /> Add New Post
            </AddBtn>
          </ActionsContainer>
        </TableHeaderLine>

        <Table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <CustomCheckbox checked={selected.length === posts.length && posts.length > 0} onChange={toggleAll} />
              </th>
              <th>Post</th>
              <th>Author</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>
                  <CustomCheckbox checked={selected.includes(post.id)} onChange={() => toggleOne(post.id)} />
                </td>
                <td>
                  <PostTitleCol>
                    <img src={post.img} alt="" className="thumb" />
                    <div className="info">
                      <div className="title">{post.title}</div>
                      <div className="excerpt">{post.excerpt}</div>
                    </div>
                  </PostTitleCol>
                </td>
                <td>
                  <AuthorCol>
                    <div className="avatar">{post.author.charAt(0)}</div>
                    <span>{post.author}</span>
                  </AuthorCol>
                </td>
                <td>
                  <Badge type={post.category}>{post.category}</Badge>
                </td>
                <td>
                  <span style={{ fontSize: '0.85rem', color: '#d0d0d5' }}>{post.date}</span>
                </td>
                <td>
                  <StatusBadge status={post.status}>{post.status}</StatusBadge>
                </td>
                <td>
                  <ActionIcons>
                    <BsEye />
                    <BsPencil />
                    <BsTrash className="delete" onClick={() => handleDeletePost(post.id)} />
                  </ActionIcons>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <PaginationRow>
          <div className="info">Showing 1 to 5 of 42 entries</div>
          <div className="pages">
            <button>Prev</button>
            <button className="circle active">1</button>
            <button className="circle">2</button>
            <button className="circle">3</button>
            <span style={{ color: 'var(--color-text-muted)' }}>...</span>
            <button className="circle">9</button>
            <button>Next</button>
          </div>
        </PaginationRow>
      </Container>

      <ModalOverlay show={showModal}>
        <ModalContent show={showModal}>
          <h3>Add New Post</h3>
          <form onSubmit={handleAddPost}>
            <FormGroup>
              <label>Post Title</label>
              <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Enter title" />
            </FormGroup>
            <FormGroup>
              <label>Excerpt & Description</label>
              <textarea required rows="3" value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Short description..." />
            </FormGroup>
            <FormGroup>
              <label>Category</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                <option>Dev</option>
                <option>Design</option>
                <option>System</option>
              </select>
            </FormGroup>
            <FormGroup>
              <label>Status</label>
              <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                <option>Draft</option>
                <option>Published</option>
                <option>Scheduled</option>
              </select>
            </FormGroup>
            <ModalActions>
              <button type="button" className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="save">Create Post</button>
            </ModalActions>
          </form>
        </ModalContent>
      </ModalOverlay>
    </AdminLayout>
  );
};

export default AdminPosts;
