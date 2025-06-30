import { Skeleton as MuiSkeleton, Box, Card, CardContent, Grid } from '@mui/material';

export const JobCardSkeleton = () => (
  <Card>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <MuiSkeleton variant="text" width="60%" height={32} />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <MuiSkeleton variant="rounded" width={100} height={24} />
            <MuiSkeleton variant="rounded" width={100} height={24} />
            <MuiSkeleton variant="rounded" width={100} height={24} />
          </Box>
          <MuiSkeleton variant="text" width="100%" />
          <MuiSkeleton variant="text" width="90%" />
          <MuiSkeleton variant="text" width="80%" />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <MuiSkeleton variant="text" width={120} />
            <MuiSkeleton variant="rounded" width={120} height={36} />
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export const JobDetailsSkeleton = () => (
  <Grid container spacing={4}>
    <Grid item xs={12} md={8}>
      <MuiSkeleton variant="text" width="80%" height={48} />
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <MuiSkeleton variant="rounded" width={120} height={32} />
        <MuiSkeleton variant="rounded" width={120} height={32} />
        <MuiSkeleton variant="rounded" width={120} height={32} />
      </Box>
      <MuiSkeleton variant="text" width="100%" height={24} />
      <MuiSkeleton variant="text" width="100%" />
      <MuiSkeleton variant="text" width="90%" />
      <MuiSkeleton variant="text" width="100%" height={24} />
      <MuiSkeleton variant="text" width="100%" />
      <MuiSkeleton variant="text" width="90%" />
      <MuiSkeleton variant="text" width="100%" height={24} />
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <MuiSkeleton variant="rounded" width={80} height={32} />
        <MuiSkeleton variant="rounded" width={80} height={32} />
        <MuiSkeleton variant="rounded" width={80} height={32} />
      </Box>
    </Grid>
    <Grid item xs={12} md={4}>
      <MuiSkeleton variant="rounded" width="100%" height={200} />
    </Grid>
  </Grid>
);

export const ProfileSkeleton = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} sx={{ textAlign: 'center' }}>
      <MuiSkeleton variant="circular" width={100} height={100} sx={{ mx: 'auto' }} />
    </Grid>
    <Grid item xs={12} md={6}>
      <MuiSkeleton variant="rounded" width="100%" height={56} />
    </Grid>
    <Grid item xs={12} md={6}>
      <MuiSkeleton variant="rounded" width="100%" height={56} />
    </Grid>
    <Grid item xs={12} md={6}>
      <MuiSkeleton variant="rounded" width="100%" height={56} />
    </Grid>
    <Grid item xs={12} md={6}>
      <MuiSkeleton variant="rounded" width="100%" height={56} />
    </Grid>
    <Grid item xs={12}>
      <MuiSkeleton variant="rounded" width="100%" height={120} />
    </Grid>
  </Grid>
);

export const DashboardSkeleton = () => (
  <>
    <MuiSkeleton variant="text" width={200} height={48} sx={{ mb: 4 }} />
    <Grid container spacing={3}>
      {[1, 2, 3].map((index) => (
        <Grid item xs={12} key={index}>
          <Card>
            <CardContent>
              <MuiSkeleton variant="text" width="60%" height={32} />
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <MuiSkeleton variant="rounded" width={80} height={24} />
                <MuiSkeleton variant="rounded" width={80} height={24} />
                <MuiSkeleton variant="rounded" width={80} height={24} />
              </Box>
              <MuiSkeleton variant="text" width="100%" />
              <MuiSkeleton variant="text" width="90%" />
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <MuiSkeleton variant="rounded" width={120} height={36} />
              <MuiSkeleton variant="rounded" width={120} height={36} />
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  </>
); 