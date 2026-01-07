import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { ActivityIndicator } from "react-native";
import ProjectsScreen from "./index";

/* =======================
   MOCK CONTEXT
======================= */
const mockLoadProjects = jest.fn();
const mockUseProjects = jest.fn();

jest.mock("@/context/ProjectsContext", () => ({
  useProjects: () => ({
    projects: [
      {
        project: {
          proj_id: "p1",
          proj_name: "Project Alpha",
          description: "Test project",
          startAt: null,
          endAt: null,
          done: false,
        },
        members: [],
      },
    ],
    loading: true,
    loadProjects: mockLoadProjects,
  }),
}));

/* =======================
   MOCK ROUTER
======================= */
const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: {
    push: mockPush,
  },
}));

/* =======================
   MOCK COMPONENT CON
======================= */
jest.mock("@/components/search/SearchBar", () => {
  const React = require("react");
  return function MockSearchBar() {
    return null;
  };
});

jest.mock("@/components/project/Create", () => {
  const React = require("react");
  return function MockCreateProjectModal() {
    return null;
  };
});

jest.mock("@/components/search/FilterPanel", () => {
  const React = require("react");
  return function MockProjectFilter() {
    return null;
  };
});

jest.mock("@/components/card/ProjectCard", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockProjectCard(props: any) {
    return <Text>{props.title}</Text>;
  };
});

/* =======================
   MOCK UI COMPONENT
======================= */
jest.mock("@/components/ui/box", () => {
  const React = require("react");
  const { View } = require("react-native");
  return { Box: View };
});

jest.mock("@/components/ui/text", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return { Text };
});



/* =======================
   TESTS
======================= */
describe("ProjectsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls loadProjects on mount", () => {
    render(<ProjectsScreen />);
    expect(mockLoadProjects).toHaveBeenCalled();
  });

  it("shows loading indicator when loading is true", () => {
     mockUseProjects.mockReturnValueOnce({
      projects: [],
      loading: true,
      loadProjects: mockLoadProjects,
    });

    const { UNSAFE_getByType } = render(<ProjectsScreen />);
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it("shows empty state when no projects", () => {
    const { getByText } = render(<ProjectsScreen />);
    expect(getByText("No matching projects")).toBeTruthy();
  });

  it("renders project list and navigates on press", () => {
     mockUseProjects.mockReturnValueOnce({
      loading: false,
      loadProjects: mockLoadProjects,
      projects: [
        {
          project: {
            proj_id: "p1",
            proj_name: "Project Alpha",
            description: "Test project",
            startAt: null,
            endAt: null,
            done: false,
          },
          members: [],
        },
      ],
    });

    const { getByText } = render(<ProjectsScreen />);

    const projectItem = getByText("Project Alpha");
    fireEvent.press(projectItem);

    expect(mockPush).toHaveBeenCalledWith("/dashboard/projects/p1");
  });
});
