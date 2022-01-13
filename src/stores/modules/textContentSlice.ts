import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";

 const textContentSlice = createSlice<Array<string>, SliceCaseReducers<Array<string>>, "textContents">({
   name: 'textContents',
   initialState: [],
   reducers: {
     setTextContents(_, action) {
      const { contents } = action.payload;
      const redefineContents: Array<string> = [...contents];
      return redefineContents;
     },

     addTextContents(state, action) {
       const { textLine } = action.payload;
       state.push(textLine);
     },
     
     removeTextContents(state) {
       state.pop();
     }
   }
 });

export const { setTextContents, addTextContents, removeTextContents } = textContentSlice.actions;

export default textContentSlice.reducer;