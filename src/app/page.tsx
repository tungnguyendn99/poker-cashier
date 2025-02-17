/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import moment from 'moment';
import { useEffect, useState } from 'react';
import API from '../utils/api';

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [tableInfo, setTableInfo] = useState<any>();
  const [players, setPlayers] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const getFormatMoney = (x: any) => {
    if (x) {
      const parts = x.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }
    return 0;
  };

  const getAllTables = async () => {
    try {
      const { data } = await API.get('/api/v1/tables');
      setData(data);
      setLoading(false);
    } catch (error) {
      console.log('error', error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTables();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleOpenDetails = (id: string) => {
    API.get(`/api/v1/tables/${id}`)
      .then((response) => {
        setTableInfo(response.data);
        setPlayers(response.data.players);
        setLoading(false);
        setIsOpen(true);
      })
      .catch((err) => {
        console.log('error', err);
        setError(err);
        setLoading(false);
      });
  };

  const handleChangeValue = (i: number, key: string, value: string) => {
    // const editPlayer = players?.[i];
    const editPlayers = players?.map((p: any, index: number) => {
      if (index === i) {
        switch (key) {
          case 'name':
            return { ...p, name: value };
          case 'buyin':
            return { ...p, buyin: value };
          case 'buyout':
            return { ...p, buyout: value };
          default:
            break;
        }
      }
      return { ...p };
    });
    setPlayers(editPlayers);
  };

  const handleAddPlayer = () => {
    setPlayers([
      {
        name: 'Name player',
        buyin: 0,
        buyout: 0,
        total: 0
      },
      ...players
    ]);
  };

  const handleDeletePlayer = (name: string) => {
    const playersEdit = players.filter((p) => p.name !== name);
    setPlayers(playersEdit);
  };

  const handleSave = async () => {
    try {
      const response = await API.patch(`/api/v1/tables/${tableInfo.id}`, {
        players
      });
      setPlayers(response.data.players);
      alert(`Save successfully.`);
      setIsEdit(false);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleCreate = async () => {
    try {
      await API.post(`/api/v1/tables/create`);
      getAllTables();
    } catch (error) {
      alert(`Please login before creating table.`);
    }
  };

  const storedUser = localStorage.getItem('user') || '';
  const user = storedUser ? JSON.parse(storedUser) : {};

  return (
    <div>
      <div className='title'>
        <h1>Poker Cashier</h1>
      </div>
      <div className='container'>
        <div className='table table-create-container'>
          {/* test */}
          <div className='tableInfo table-create'>
            <button onClick={handleCreate}>Tạo bàn</button>
          </div>
        </div>
        {data?.map((item: any, i = 0) => {
          return (
            <div key={i} className='table'>
              {/* test */}
              <div className='tableInfo'>
                <p>
                  id: <span>{item.id}</span>
                </p>
                <p>
                  Host: <span>{item.host}</span>
                </p>
                <p>
                  Ngày tạo:{' '}
                  <span>
                    {moment(item.createdAt).format('DD/MM/YYYY HH:mm')}
                  </span>
                </p>
                <button onClick={() => handleOpenDetails(item.id)}>
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {isOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <button
              className='modal-button-close'
              type='button'
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
            <div className='modal-title'>
              <p>Players:</p>
            </div>
            <div className='players-list'>
              {players?.map((item: any, i: number) => {
                return (
                  <div className='player' key={i}>
                    <div className='row'>
                      <div className='cell player-id'>
                        {/* <span>Player 1</span> */}
                        {isEdit ? (
                          <input
                            className='input-name'
                            type='text'
                            value={item.name || ''}
                            onChange={(e: any) =>
                              handleChangeValue(i, 'name', e.target.value)
                            }
                          />
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </div>
                      <div className='player-action'>
                        <button
                          className='btn-delete'
                          type='button'
                          onClick={() => handleDeletePlayer(item.name)}
                        >
                          Delete
                        </button>
                      </div>
                      <div className='cell'>
                        <span className='hidden-label'>Buy-in:</span>
                        {isEdit ? (
                          <input
                            type='text'
                            value={item.buyin || ''}
                            onChange={(e: any) =>
                              handleChangeValue(i, 'buyin', e.target.value)
                            }
                          />
                        ) : (
                          <span className='value'>
                            {getFormatMoney(item.buyin)}
                          </span>
                        )}
                      </div>
                      <div className='cell'>
                        <span className='hidden-label'>Buy-out:</span>
                        {isEdit ? (
                          <input
                            type='text'
                            value={item.buyout || ''}
                            onChange={(e: any) =>
                              handleChangeValue(i, 'buyout', e.target.value)
                            }
                          />
                        ) : (
                          <span className='value'>
                            {getFormatMoney(item.buyout)}
                          </span>
                        )}
                      </div>
                      <div></div>
                      <div
                        className={
                          item.total > 0 ? 'cell positive' : 'cell negative'
                        }
                      >
                        <span className='hidden-label'>Total:</span>
                        <span className='value'>
                          {getFormatMoney(item.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {user.username === tableInfo.host && (
              <div className='btn-container'>
                <button
                  className='btn-add'
                  type='button'
                  onClick={handleAddPlayer}
                >
                  Add
                </button>
                {isEdit ? (
                  <button
                    className='btn-edit'
                    type='button'
                    onClick={() => setIsEdit(false)}
                  >
                    View
                  </button>
                ) : (
                  <button
                    className='btn-edit'
                    type='button'
                    onClick={() => setIsEdit(true)}
                  >
                    Edit
                  </button>
                )}
                <button className='btn-save' type='button' onClick={handleSave}>
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
