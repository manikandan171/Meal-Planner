import { useReducer } from "react";

const initialState = {
  like: 0,
  dislike: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LIKE':
      return { ...state, like: state.like + 1 };
    case 'DISLIKE':
      return { ...state, dislike: state.dislike + 1 };
    default:
      return state;
  }
};

const LikeDislike = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Likes: {state.like}</h1>
      <h1>Dislikes: {state.dislike}</h1>
      <button onClick={() => dispatch({ type: 'LIKE' })} style={{ margin: '5px', fontSize: '20px' }}>
        👍 Like
      </button>
      <button onClick={() => dispatch({ type: 'DISLIKE' })} style={{ margin: '5px', fontSize: '20px' }}>
        👎 Dislike
      </button>
    </div>
  );
};

export default LikeDislike; 