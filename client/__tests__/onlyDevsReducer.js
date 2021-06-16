import subject from '../src/reducers/onlyDevsReducer.js'


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

})