const subject = require('../src/reducers/onlyDevsReducer.js');


describe('onlyDevsReducer', () => {
  let state;

    beforeEach( () => {
      state = {
        id: null,
        username: "",
        githubToken: null,
        profilePic: "",
        bio: "",
        languages: "",
        current_project: "",
        matches: [],
        likes: [],
        explore: [],
      };
    });

    describe('default state', () => {
      it('should return a default state when given an undefined input', () => {
        expect(subject(undefined, { type: undefined })).toEqual(state);
      });
    });

    
    describe('update likes', () => {
      it('should update users liked by', () => {
        const action = {
          type: 'UPDATE_LIKEDBY',
          payload: ['davette', 'jeff', 'victor']
        };
        expect(subject(state, action).likes).toBe(action.payload);
      });
    });
    
    describe('update username', () => {
      it('should update username', () => {
        const action = {
          type: 'EDIT_PROFILE_NAME',
          payload: 'Dracula'
        };
        expect(subject(state, action).username).toBe(action.payload);
      });
    });

    describe('update the explore page', () => {
      it('should return an array of users', () => {
        const action = {
          type: 'UPDATE_EXPLORE',
          payload: ['Dracula', 'Jeff', 'Victor']
        };
        expect(subject(state, action).explore).toBe(action.payload);
      });
    });


})