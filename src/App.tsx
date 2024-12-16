import { Route, Routes } from "react-router-dom";
import AuthProvider from "./features/Auth/Context/AuthProvider";
import Login from "./features/Auth/Login/Login";
import PersistLogin from "./features/Auth/PersistAuth";
import Register from "./features/Auth/Register/Register";
import RequireAuth from "./features/Auth/RequireAuth";
import Unauthorized from "./features/Auth/Unauthorized";
import CharacterListPage from "./features/Character/CharacterListPage";
import EpisodeEditor from "./features/Editor/EpisodeEditor";
import Emotion from "./features/Emotion/Emotion";
import Missing from "./features/Missing/Missing";
import Profile from "./features/Profile/Profile";
import StorySinglePage from "./features/StorySinglePage/StorySinglePage";
import Wardrobe from "./features/Wardrobe/Wardrobe";
import AuthLayout from "./layouts/AuthLayout";
import ProfileLayout from "./layouts/ProfileLayout";
import StoryLayout from "./layouts/StoryLayout";
import KeyBinds from "./features/StorySinglePage/KeyBinds/KeyBinds";
import useHandleTheme from "./hooks/helpers/shared/useHandleTheme";

export default function App() {
  useHandleTheme();

  return (
    <AuthProvider>
      <Routes>
        <Route element={<AuthLayout />} path="auth">
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
        </Route>

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={["scriptwriter", "editor", "headscriptwriter", "translator"]} />}>
            <Route element={<StoryLayout />}>
              <Route path="stories/:storyId" element={<StorySinglePage />} />
              <Route path="stories/:storyId/emotions" element={<Emotion />} />
              <Route path="stories/:storyId/wardrobes" element={<Wardrobe />} />
              <Route path="stories/:storyId/keyBinds" element={<KeyBinds />} />
              <Route path="stories/:storyId/characters" element={<CharacterListPage />} />
              <Route path="stories/:storyId/editor/episodes/:episodeId" element={<EpisodeEditor />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["translator", "editor", "headscriptwriter", "scriptwriter"]} />}>
            <Route element={<ProfileLayout />} path="profile/:staffId">
              <Route index element={<Profile />} />
            </Route>
          </Route>

          <Route element={<Unauthorized />} path="unauthorized" />
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
