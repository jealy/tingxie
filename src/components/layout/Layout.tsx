const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background pb-20">
      {children}
    </div>
  );
};

export default Layout;
